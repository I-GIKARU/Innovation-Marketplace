from flask import request, jsonify, make_response
from flask_restful import Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from models import User
from datetime import timedelta
from utils.firebase_auth import verify_firebase_token, create_or_get_user_from_firebase

class CurrentUser(Resource):
    @jwt_required(optional=True) # Allow access without token
    def get(self):
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            identity = get_jwt_identity()
            logger.info(f"CurrentUser endpoint called with identity: {identity}")
            
            if identity:
                try:
                    # Convert string identity back to int and fetch user from database
                    user_id = int(identity)
                    logger.info(f"Looking up user with ID: {user_id}")
                    
                    user = User.query.get(user_id)
                    if user:
                        logger.info(f"Found user: {user.email}")
                        # Use the to_dict method for proper serialization
                        user_data = user.to_dict()
                        return jsonify({"user": user_data})
                    else:
                        logger.warning(f"No user found with ID: {user_id}")
                        return jsonify({"user": None})
                except ValueError as e:
                    logger.error(f"Invalid user ID format: {identity}, error: {e}")
                    return jsonify({"user": None})
                except Exception as e:
                    logger.error(f"Error fetching user: {e}")
                    return {"message": f"Error fetching user: {str(e)}"}, 500
            else:
                logger.info("No identity found in JWT token")
                return jsonify({"user": None})
        except Exception as exc:
            logger.error(f"Unexpected error in CurrentUser endpoint: {exc}")
            return {"message": f"Error verifying user: {str(exc)}"}, 500

class FirebaseLogin(Resource):
    def post(self):
        """
        Firebase authentication endpoint
        Supports both Google Sign-In (students) and email/password (admin)
        Automatically creates accounts on first login with appropriate roles
        """
        try:
            data = request.get_json()
            
            if not data or 'idToken' not in data:
                return {'message': 'Firebase ID token required'}, 400
            
            id_token = data['idToken']
            
            # Verify Firebase token
            firebase_user_data, error = verify_firebase_token(id_token)
            if error:
                return {'error': error}, 401
            
            # Create or get user from database (automatic registration on first login)
            user, error = create_or_get_user_from_firebase(firebase_user_data, role_name=None)
            if error:
                return {'error': error}, 500
            
            if not user:
                return {'error': 'Failed to authenticate user'}, 500
            
            # Create JWT token for the session
            access_token = create_access_token(
                identity=str(user.id),
                expires_delta=timedelta(hours=24)
            )
            
            user_identity = {
                'id': user.id,
                'email': user.email,
                'role': user.role.name,
                'auth_provider': user.auth_provider
            }
            
            response = make_response(jsonify({
                'user': user_identity,
                'message': 'Google sign-in successful'
                # Token is set as HTTP-only cookie, not in response body
            }), 200)
            
            # Set JWT cookie for session management
            set_access_cookies(response, access_token)
            
            return response
            
        except Exception as exc:
            return {'error': f'Google sign-in failed: {str(exc)}'}, 500

class UserLogout(Resource):
    def post(self):
        response = make_response(jsonify({'message': 'Logged out successfully'}), 200)
        unset_jwt_cookies(response)
        return response
