import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from dotenv import load_dotenv
from config import Config
from models import db, bcrypt, User, Role

load_dotenv()

jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app,
         supports_credentials=True,
         origins=['*'],
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

    api = Api(app)

    from resources.auth import setup_routes as auth_setup_routes
    from resources.projects import setup_routes as projects_setup_routes
    from resources.admin import setup_routes as admin_setup_routes
    from resources.merch import setup_routes as merchandise_setup_routes
    from resources.orders import setup_routes as orders_setup_routes
    from resources.user_projects import setuser_project_routes as user_projects_setup_routes

    
    auth_setup_routes(api)
    projects_setup_routes(api)
    admin_setup_routes(api)
    merchandise_setup_routes(api)
    orders_setup_routes(api)
    user_projects_setup_routes(api)

    # ✅ Create default admin immediately in app context
    with app.app_context():
        try:
            # Check if tables exist before querying
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            if 'roles' in inspector.get_table_names() and 'users' in inspector.get_table_names():
                # Create all roles if they don't exist
                roles_to_create = [
                    {'name': 'admin', 'desc': 'Administrator role'},
                    {'name': 'student', 'desc': 'Student developer'},
                    {'name': 'client', 'desc': 'clients'}
                ]
                
                created_roles = []
                for role_data in roles_to_create:
                    existing_role = Role.query.filter_by(name=role_data['name']).first()
                    if not existing_role:
                        new_role = Role(name=role_data['name'], desc=role_data['desc'])
                        db.session.add(new_role)
                        created_roles.append(role_data['name'])
                
                if created_roles:
                    db.session.flush()  # Flush to get role IDs
                    print(f"✅ Created roles: {', '.join(created_roles)}")
                
                # Create admin user if it doesn't exist
                if not User.query.join(Role).filter(Role.name == 'admin').first():
                    admin_email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@example.com")
                    admin_password = os.getenv("DEFAULT_ADMIN_PASSWORD", "StrongPass123!")

                    print("⚠️ No admin found — creating default admin...")
                    # Get the admin role (should exist now)
                    admin_role = Role.query.filter_by(name='admin').first()

                    admin = User(email=admin_email, role_id=admin_role.id)
                    admin.password = admin_password
                    db.session.add(admin)
                    db.session.commit()
                    print(f"✅ Admin created: {admin_email}")
                else:
                    # Still commit if we created roles but no admin
                    if created_roles:
                        db.session.commit()
            else:
                print("⚠️ Database tables don't exist yet.")
                print("Run 'flask db init', 'flask db migrate', and 'flask db upgrade' to set up the database.")
        except Exception as e:
            print(f"⚠️ Database not ready: {e}")
            print("Run 'flask db init', 'flask db migrate', and 'flask db upgrade' to set up the database.")

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
