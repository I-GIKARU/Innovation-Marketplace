from firebase_admin import auth
from flask import request, jsonify
from functools import wraps
import logging

logger = logging.getLogger(__name__)

def verify_firebase_token(id_token):
    """
    Verify Firebase ID token and return decoded token
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token, None
    except auth.InvalidIdTokenError as e:
        logger.error(f"Invalid Firebase token: {e}")
        return None, "Invalid authentication token"
    except auth.ExpiredIdTokenError as e:
        logger.error(f"Expired Firebase token: {e}")
        return None, "Authentication token has expired"
    except Exception as e:
        logger.error(f"Firebase token verification error: {e}")
        return None, "Authentication failed"

def firebase_auth_required(f):
    """
    Decorator to require Firebase authentication
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization header required'}), 401
        
        id_token = auth_header.split('Bearer ')[1]
        
        decoded_token, error = verify_firebase_token(id_token)
        if error:
            return jsonify({'error': error}), 401
        
        # Add decoded token to request context
        request.firebase_user = decoded_token
        return f(*args, **kwargs)
    
    return decorated

def get_firebase_user_from_request():
    """
    Get Firebase user data from the current request
    """
    return getattr(request, 'firebase_user', None)

def create_or_get_user_from_firebase(firebase_user_data, role_name=None, additional_data=None):
    """
    Create or retrieve user from database based on Firebase user data
    """
    from models import User, Role, db
    from utils.validation import validate_student_email, validate_email_format
    
    firebase_uid = firebase_user_data.get('uid')
    email = firebase_user_data.get('email')
    
    if not firebase_uid or not email:
        return None, "Invalid Firebase user data"
    
    # Try to find existing user by Firebase UID
    user = User.query.filter_by(firebase_uid=firebase_uid).first()
    
    if user:
        return user, None
    
    # Try to find existing user by email (for migration purposes) 
    user = User.query.filter_by(email=email).first()
    
    if user:
        # Update existing user with Firebase UID
        user.firebase_uid = firebase_uid
        user.auth_provider = 'firebase'
        db.session.commit()
        return user, None
    
    # Create new user
    try:
        # Determine role
        if role_name:
            role = Role.query.filter_by(name=role_name).first()
        elif email.endswith('@student.moringaschool.com'):
            role = Role.query.filter_by(name='student').first()
        elif email == 'admin@example.com':  # Special case for admin
            role = Role.query.filter_by(name='admin').first()
        else:
            role = Role.query.filter_by(name='client').first()  # Default to client
        
        if not role:
            return None, f"Invalid role: {role_name}"
        
        # Validate email based on role
        if role.name == 'student':
            is_valid_email, email_message = validate_student_email(email)
            if not is_valid_email:
                return None, email_message
        else:
            is_valid_email, email_message = validate_email_format(email)
            if not is_valid_email:
                return None, email_message
        
        # Prepare user data
        user_data = {
            'email': email,
            'firebase_uid': firebase_uid,
            'auth_provider': 'firebase',
            'role_id': role.id
        }
        
        # Add additional fields based on role and provided data
        if additional_data:
            if role.name == 'student':
                user_data.update({
                    'bio': additional_data.get('bio'),
                    'socials': additional_data.get('socials'),
                    'past_projects': additional_data.get('past_projects')
                })
            elif role.name == 'client':
                user_data.update({
                    'company': additional_data.get('company')
                })
            
            # Common fields
            user_data['phone'] = additional_data.get('phone')
        
        new_user = User(**user_data)
        
        db.session.add(new_user)
        db.session.commit()
        
        return new_user, None
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating user from Firebase: {e}")
        return None, "Failed to create user account"
