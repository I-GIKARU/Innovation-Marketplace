from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps
from models import User
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
