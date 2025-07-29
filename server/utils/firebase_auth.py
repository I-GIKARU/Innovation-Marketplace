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
            return {'error': 'Authorization header required'}, 401
        
        id_token = auth_header.split('Bearer ')[1]
        
        decoded_token, error = verify_firebase_token(id_token)
        if error:
            return {'error': error}, 401
        
        # Add decoded token to request context
        request.firebase_user = decoded_token
        return f(*args, **kwargs)
    
    return decorated

def get_firebase_user_from_request():
    """
    Get Firebase user data from the current request
    """
    return getattr(request, 'firebase_user', None)

def create_or_get_user_from_firebase(firebase_user_data, role_name=None):
    """
    Create or retrieve user from database based on Firebase user data
    Supports both Google Sign-In (students) and email/password (admin) authentication
    Automatically creates accounts on first login with appropriate roles
    """
    from models import User, Role, db
    from utils.validation import validate_student_email, validate_email_format
    
    firebase_uid = firebase_user_data.get('uid')
    email = firebase_user_data.get('email')
    display_name = firebase_user_data.get('name', '')  # From Google profile
    
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
        user.auth_provider = 'google'
        db.session.commit()
        return user, None
    
    # Create new user automatically on first Google sign-in
    try:
        # Determine role - automatic role assignment based on email domain
        if email.endswith('@student.moringaschool.com'):
            role = Role.query.filter_by(name='student').first()
        elif email == 'admin@innovation.marketplace.com':  # Special case for admin
            role = Role.query.filter_by(name='admin').first()
        else:
            # Only students with institutional emails can sign up automatically
            return None, "Only students with @student.moringaschool.com email can register. Contact admin for other access."
        
        if not role:
            return None, "Unable to determine user role"
        
        # Validate email based on role
        if role.name == 'student':
            is_valid_email, email_message = validate_student_email(email)
            if not is_valid_email:
                return None, email_message
        else:
            is_valid_email, email_message = validate_email_format(email)
            if not is_valid_email:
                return None, email_message
        
        # Create user data (only include fields that exist in User model)
        user_data = {
            'email': email,
            'firebase_uid': firebase_uid,
            'auth_provider': 'google',
            'role_id': role.id
        }
        
        new_user = User(**user_data)
        
        db.session.add(new_user)
        db.session.commit()
        
        logger.info(f"Created new user account for {email} via Google Sign-In")
        return new_user, None
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating user from Google Sign-In: {e}")
        return None, "Failed to create user account"
