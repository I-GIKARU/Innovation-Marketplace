from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps

def role_required(role_name):
    
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity()
            if not isinstance(identity, dict) or identity.get('role') != role_name:
                return jsonify({'message': f'{role_name.capitalize()} role required!'}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def admin_or_role_required(allowed_role_names):

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity()
            if not isinstance(identity, dict):
                return jsonify({'error': 'Invalid identity'}), 400
            user_role = identity.get('role')
            if user_role not in allowed_role_names and user_role != 'admin':
                return jsonify({'message': 'Insufficient permissions'}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
