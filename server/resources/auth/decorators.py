from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps
from models import User
from utils.firebase_auth import verify_firebase_token, get_firebase_user_from_request
def get_current_user():
    """Helper function to get current user from JWT token"""
    identity = get_jwt_identity()
    if identity:
        try:
            # Identity is now a string containing the user ID
            user_id = int(identity)
            return User.query.get(user_id)
        except (ValueError, TypeError):
            return None
    return None


def role_required(role_name):
    
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user = get_current_user()
            if not current_user or current_user.role.name != role_name:
                return jsonify({'message': f'{role_name.capitalize()} role required!'}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def admin_or_role_required(allowed_role_names):

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user = get_current_user()
            if not current_user:
                return jsonify({'error': 'User not found'}), 404
            user_role = current_user.role.name
            if user_role not in allowed_role_names and user_role != 'admin':
                return jsonify({'message': 'Insufficient permissions'}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def flexible_auth_required(f):
    """
    Decorator that supports both JWT (cookie-based) and Firebase (Bearer token) authentication
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            # Try JWT authentication first (existing cookie-based auth)
            verify_jwt_in_request(optional=True)
            current_user = get_current_user()
            
            if current_user:
                # JWT authentication successful
                request.current_user = current_user
                return f(*args, **kwargs)
            
            # Try Firebase authentication
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                id_token = auth_header.split('Bearer ')[1]
                firebase_user_data, error = verify_firebase_token(id_token)
                
                if not error:
                    # Find user by Firebase UID
                    firebase_user = User.query.filter_by(
                        firebase_uid=firebase_user_data.get('uid')
                    ).first()
                    
                    if firebase_user:
                        request.current_user = firebase_user
                        return f(*args, **kwargs)
            
            return jsonify({'error': 'Authentication required'}), 401
            
        except Exception as e:
            return jsonify({'error': 'Authentication failed'}), 401
    
    return decorated
