from flask import request, jsonify, make_response
from flask_restful import Resource
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    verify_jwt_in_request,
    set_access_cookies,
    unset_jwt_cookies,
)
from functools import wraps
from models import (
    db,
    Student,
    Client,
    Admin,
    User,
    Project,
    Merchandise,
    Order,
    ClientInterest,
    ProjectStudent,
)
from utils.validation import (
    validate_student_email,
    validate_email_format,
    validate_password_strength,
)
from datetime import timedelta


# Role-based access decorator
def role_required(role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity()
            if not isinstance(identity, dict) or identity.get("role") != role:
                return {"message": f"{role.capitalize()} role required!"}, 403
            return fn(*args, **kwargs)

        return decorator

    return wrapper


# Admin or specific role required decorator
def admin_or_role_required(allowed_roles):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity()
            if not isinstance(identity, dict):
                return {"error": "Invalid identity format"}, 400
            user_role = identity.get("role")
            if user_role not in allowed_roles and user_role != "admin":
                return {"message": "Insufficient permissions"}, 403
            return fn(*args, **kwargs)

        return decorator

    return wrapper


# Resource: User Registration
class UserRegistration(Resource):
    def post(self):
        try:
            data = request.get_json()

            if not data or "email" not in data or "password" not in data:
                return {"message": "Email and password required"}, 400

            role = data.get("role", "student")

            is_valid_password, password_message = validate_password_strength(
                data["password"]
            )
            if not is_valid_password:
                return {"error": password_message}, 400

            if role == "student":
                return self._register_student(data)
            elif role == "client":
                return self._register_client(data)
            elif role == "user":
                return self._register_user(data)
            elif role == "admin":
                return self._register_admin(data)
            else:
                return {"error": "Invalid role specified"}, 400

        except Exception as exc:
            db.session.rollback()
            return {"error": str(exc)}, 500

    def _register_student(self, data):

        is_valid_email, email_message = validate_student_email(data["email"])
        if not is_valid_email:
            return {"error": email_message}, 400

        if Student.query.filter_by(email=data["email"]).first():
            return {"error": "Student with this email already exists"}, 400

        required_fields = ["name"]
        for field in required_fields:
            if field not in data:
                return {"error": f"Missing student field: {field}"}, 400

        student = Student(
            name=data["name"],
            email=data["email"],
            bio=data.get("bio", ""),
            skills=data.get("skills", ""),
            github_link=data.get("github_link", ""),
            linkedin_link=data.get("linkedin_link", ""),
            past_projects=data.get("past_projects", ""),
        )
        student.set_password(data["password"])

        db.session.add(student)
        db.session.commit()

        identity = {"id": student.id, "email": student.email, "role": "student"}
        access_token = create_access_token(
            identity=identity, expires_delta=timedelta(hours=24)
        )

        response = make_response(
            jsonify(
                {
                    "message": "Student registered successfully",
                    "user": identity,
                    "student": student.to_dict(),
                }
            ),
            201,
        )
        set_access_cookies(response, access_token)
        return response

    def _register_client(self, data):

        is_valid_email, email_message = validate_email_format(data["email"])
        if not is_valid_email:
            return {"error": email_message}, 400

        if Client.query.filter_by(email=data["email"]).first():
            return {"error": "Client with this email already exists"}, 400

        required_fields = ["name"]
        for field in required_fields:
            if field not in data:
                return {"error": f"Missing client field: {field}"}, 400

        client = Client(
            name=data["name"],
            email=data["email"],
            company=data.get("company", ""),
            phone=data.get("phone", ""),
        )
        client.set_password(data["password"])

        db.session.add(client)
        db.session.commit()

        identity = {"id": client.id, "email": client.email, "role": "client"}
        access_token = create_access_token(
            identity=identity, expires_delta=timedelta(hours=24)
        )

        response = make_response(
            jsonify(
                {
                    "message": "Client registered successfully",
                    "user": identity,
                    "client": client.to_dict(),
                }
            ),
            201,
        )
        set_access_cookies(response, access_token)
        return response

    def _register_user(self, data):

        is_valid_email, email_message = validate_email_format(data["email"])
        if not is_valid_email:
            return {"error": email_message}, 400

        if User.query.filter_by(email=data["email"]).first():
            return {"error": "User with this email already exists"}, 400

        user = User(email=data["email"], phone=data.get("phone", ""))
        user.set_password(data["password"])

        db.session.add(user)
        db.session.commit()

        identity = {"id": user.id, "email": user.email, "role": "user"}
        access_token = create_access_token(
            identity=identity, expires_delta=timedelta(hours=24)
        )

        response = make_response(
            jsonify(
                {
                    "message": "User registered successfully",
                    "user": identity,
                    "user_data": user.to_dict(),
                }
            ),
            201,
        )
        set_access_cookies(response, access_token)
        return response

    def _register_admin(self, data):

        try:
            verify_jwt_in_request()
            current_user = get_jwt_identity()
            if not current_user or current_user.get("role") != "admin":
                return {"error": "Only admins can create admin accounts"}, 403
        except:
            return {"error": "Admin authentication required"}, 403

        is_valid_email, email_message = validate_email_format(data["email"])
        if not is_valid_email:
            return {"error": email_message}, 400

        if Admin.query.filter_by(email=data["email"]).first():
            return {"error": "Admin with this email already exists"}, 400

        required_fields = ["name"]
        for field in required_fields:
            if field not in data:
                return {"error": f"Missing admin field: {field}"}, 400

        admin = Admin(name=data["name"], email=data["email"])
        admin.set_password(data["password"])

        db.session.add(admin)
        db.session.commit()

        return {"message": "Admin created successfully"}, 201


# Resource: User Login
class UserLogin(Resource):
    def post(self):
        try:
            data = request.get_json()

            if not data or "email" not in data or "password" not in data:
                return {"message": "Email and password required"}, 400

            email = data["email"]
            password = data["password"]
            role = data.get("role", "student")

            user = None
            if role == "student":
                user = Student.query.filter_by(email=email).first()
            elif role == "client":
                user = Client.query.filter_by(email=email).first()
            elif role == "admin":
                user = Admin.query.filter_by(email=email).first()
            elif role == "user":
                user = User.query.filter_by(email=email).first()

            if not user or not user.check_password(password):
                return {"message": "Invalid credentials"}, 401

            identity = {"id": user.id, "email": user.email, "role": role}

            access_token = create_access_token(
                identity=identity, expires_delta=timedelta(hours=24)
            )

            response = make_response(
                jsonify({"user": identity, "message": "Login successful"}), 200
            )
            set_access_cookies(response, access_token)
            return response

        except Exception as exc:
            return {"error": str(exc)}, 500


class CurrentUser(Resource):
    def get(self):
        try:
            verify_jwt_in_request(optional=True)
            identity = get_jwt_identity()
            if identity:
                return jsonify({"user": identity})
            return jsonify({"user": None})
        except:
            return {"message": "Error verifying user"}, 500


class UserLogout(Resource):
    def post(self):
        response = make_response(jsonify({"message": "Logged out successfully"}), 200)
        unset_jwt_cookies(response)
        return response


class UserProfile(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user_id = current_user["id"]
        role = current_user["role"]

        user = None
        if role == "student":
            user = Student.query.get(user_id)
        elif role == "client":
            user = Client.query.get(user_id)
        elif role == "admin":
            user = Admin.query.get(user_id)
        elif role == "user":
            user = User.query.get(user_id)

        if not user:
            return {"message": "User not found"}, 404

        profile_data = {
            "id": user.id,
            "email": getattr(user, "email", None),
            "role": role,
        }

        if role == "student":
            profile_data.update(
                {
                    "name": user.name,
                    "bio": user.bio,
                    "skills": user.skills,
                    "github_link": user.github_link,
                    "linkedin_link": user.linkedin_link,
                    "past_projects": user.past_projects,
                }
            )
        elif role == "client":
            profile_data.update(
                {"name": user.name, "company": user.company, "phone": user.phone}
            )
        elif role == "admin":
            profile_data.update({"name": user.name})
        elif role == "user":
            profile_data.update({"phone": user.phone})

        return {"user": profile_data}, 200

    @jwt_required()
    def put(self):
        current_user = get_jwt_identity()
        user_id = current_user["id"]
        role = current_user["role"]
        data = request.get_json()

        user = None
        if role == "student":
            user = Student.query.get(user_id)
        elif role == "client":
            user = Client.query.get(user_id)
        elif role == "admin":
            user = Admin.query.get(user_id)
        elif role == "user":
            user = User.query.get(user_id)

        if not user:
            return {"message": "User not found"}, 404

        try:
            if role == "student":
                if "email" in data and data["email"] != user.email:
                    is_valid, message = validate_student_email(data["email"])
                    if not is_valid:
                        return {"error": message}, 400
                    if Student.query.filter_by(email=data["email"]).first():
                        return {"error": "Email already exists"}, 400
                    user.email = data["email"]

                user.name = data.get("name", user.name)
                user.bio = data.get("bio", user.bio)
                user.skills = data.get("skills", user.skills)
                user.github_link = data.get("github_link", user.github_link)
                user.linkedin_link = data.get("linkedin_link", user.linkedin_link)
                user.past_projects = data.get("past_projects", user.past_projects)

            elif role == "client":
                if "email" in data and data["email"] != user.email:
                    is_valid, message = validate_email_format(data["email"])
                    if not is_valid:
                        return {"error": message}, 400
                    if Client.query.filter_by(email=data["email"]).first():
                        return {"error": "Email already exists"}, 400
                    user.email = data["email"]

                user.name = data.get("name", user.name)
                user.company = data.get("company", user.company)
                user.phone = data.get("phone", user.phone)

            elif role == "user":
                if "email" in data and data["email"] != user.email:
                    is_valid, message = validate_email_format(data["email"])
                    if not is_valid:
                        return {"error": message}, 400
                    if User.query.filter_by(email=data["email"]).first():
                        return {"error": "Email already exists"}, 400
                    user.email = data["email"]

                user.phone = data.get("phone", user.phone)

            if data.get("password"):
                is_valid_password, password_message = validate_password_strength(
                    data["password"]
                )
                if not is_valid_password:
                    return {"error": password_message}, 400
                user.set_password(data["password"])

            db.session.commit()
            return {"message": "Profile updated successfully"}, 200

        except Exception as exc:
            db.session.rollback()
            return {"error": str(exc)}, 500


# Dashboard Resources
class StudentDashboard(Resource):
    @jwt_required()
    @role_required("student")
    def get(self):
        current_user = get_jwt_identity()
        student = Student.query.get(current_user["id"])

        if not student:
            return {"error": "Student profile not found"}, 404

        project_associations = ProjectStudent.query.filter_by(
            student_id=student.id
        ).all()
        projects = [Project.query.get(pa.project_id) for pa in project_associations]

        interests = []
        for project in projects:
            project_interests = ClientInterest.query.filter_by(
                project_id=project.id
            ).all()
            interests.extend(project_interests)

        return {
            "student": student.to_dict(),
            "projects": [project.to_dict() for project in projects if project],
            "client_interests": [interest.to_dict() for interest in interests],
        }, 200


class ClientDashboard(Resource):
    @jwt_required()
    @role_required("client")
    def get(self):
        current_user = get_jwt_identity()
        client = Client.query.get(current_user["id"])

        if not client:
            return {"error": "Client profile not found"}, 404

        interests = ClientInterest.query.filter_by(client_id=client.id).all()

        return {
            "client": client.to_dict(),
            "interests": [interest.to_dict() for interest in interests],
        }, 200


class UserDashboard(Resource):
    @jwt_required()
    @role_required("user")
    def get(self):
        current_user = get_jwt_identity()
        user = User.query.get(current_user["id"])

        if not user:
            return {"error": "User profile not found"}, 404

        orders = Order.query.filter_by(user_id=user.id).all()

        return {
            "user": user.to_dict(),
            "orders": [order.to_dict() for order in orders],
        }, 200


class AdminDashboard(Resource):
    @jwt_required()
    @role_required("admin")
    def get(self):

        stats = {
            "students": Student.query.count(),
            "clients": Client.query.count(),
            "users": User.query.count(),
            "projects": Project.query.count(),
            "approved_projects": Project.query.filter_by(is_approved=True).count(),
            "pending_projects": Project.query.filter_by(status="pending").count(),
            "merchandise": Merchandise.query.count(),
            "orders": Order.query.count(),
            "completed_orders": Order.query.filter_by(status="completed").count(),
        }

        recent_projects = (
            Project.query.filter_by(status="pending")
            .order_by(Project.id.desc())
            .limit(5)
            .all()
        )

        return {
            "stats": stats,
            "recent_projects": [project.to_dict() for project in recent_projects],
        }, 200


def setup_routes(api):
    api.add_resource(UserRegistration, "/api/register")
    api.add_resource(UserLogin, "/api/login")
    api.add_resource(CurrentUser, "/api/me")
    api.add_resource(UserLogout, "/api/logout")
    api.add_resource(UserProfile, "/api/profile")

    # Dashboard routes
    api.add_resource(StudentDashboard, "/api/dashboard/student")
    api.add_resource(ClientDashboard, "/api/dashboard/client")
    api.add_resource(UserDashboard, "/api/dashboard/user")
    api.add_resource(AdminDashboard, "/api/dashboard/admin")
