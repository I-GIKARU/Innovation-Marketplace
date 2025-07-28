import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from dotenv import load_dotenv
from config import Config
from models import db, User, Role
import firebase_admin
from firebase_admin import credentials, auth
from utils.cloudinary_storage import init_cloudinary

load_dotenv()

jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__, static_folder='static')
    
    # Load config and set dynamic properties
    config_instance = Config()
    app.config.from_object(config_instance)
    
    # Override with dynamic property
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = config_instance.SQLALCHEMY_ENGINE_OPTIONS
    
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app,
         supports_credentials=True,
         origins=['*'],
         allow_headers=['Content-Type', 'Authorization', 'Cookie', 'Access-Control-Allow-Credentials'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         expose_headers=['Set-Cookie'],
         send_wildcard=False)

    # Initialize Firebase Admin SDK
    try:
        if not firebase_admin._apps:
            project_id = app.config.get('FIREBASE_PROJECT_ID')
            
            if project_id:
                # Use the new credential method from Config
                cred = Config.get_firebase_credentials()
                
                if cred:
                    storage_bucket = app.config.get('FIREBASE_STORAGE_BUCKET', f'{project_id}.firebasestorage.app')
                    firebase_admin.initialize_app(cred, {
                        'storageBucket': storage_bucket
                    })
                    
                    # Determine which credential method was used
                    cred_method = "JSON string" if Config.GOOGLE_CREDENTIALS_JSON else "service account file"
                    print(f"✅ Firebase Admin SDK initialized using {cred_method}")
                    print(f"✅ Storage bucket: {storage_bucket}")
                    print(f"✅ Project ID: {project_id}")
                else:
                    print("⚠️ Firebase credentials not found or invalid")
                    print("Set either:")
                    print("  - FIREBASE_SERVICE_ACCOUNT_KEY (path to JSON file) for local development")
                    print("  - GOOGLE_CREDENTIALS_JSON (JSON string) for deployment")
                    print("  - Ensure FIREBASE_PROJECT_ID is also set")
            else:
                print("⚠️ FIREBASE_PROJECT_ID not found in environment variables")
    except Exception as e:
        print(f"⚠️ Firebase initialization failed: {e}")

    # Initialize Cloudinary
    try:
        init_cloudinary(app)
        print(f"✅ Cloudinary initialized")
    except Exception as e:
        print(f"⚠️ Cloudinary initialization failed: {e}")

    api = Api(app)

    from resources.auth import setup_routes as auth_setup_routes
    from resources.projects import setup_routes as projects_setup_routes
    from resources.admin import setup_routes as admin_setup_routes
    from resources.merch import setup_routes as merchandise_setup_routes
    from resources.sales import setup_routes as sales_setup_routes
    from resources.user_projects import setuser_project_routes as user_projects_setup_routes
    from resources.migrate import setup_routes as migrate_setup_routes
    from resources.ai_agent import setup_ai_routes

    
    auth_setup_routes(api)
    projects_setup_routes(api)
    admin_setup_routes(api)
    merchandise_setup_routes(api)
    sales_setup_routes(api)
    user_projects_setup_routes(api)
    migrate_setup_routes(api)
    setup_ai_routes(api)
    
    # ✅ Create default roles on app startup  
    # Use a background function to avoid blocking the main thread
    def setup_default_roles():
        with app.app_context():
            try:
                # Quick check if database is accessible
                from sqlalchemy import text
                db.session.execute(text('SELECT 1')).fetchone()
                
                # Check if tables exist before querying
                from sqlalchemy import inspect
                inspector = inspect(db.engine)
                if 'roles' in inspector.get_table_names():
                    # Create all roles if they don't exist
                    roles_to_create = [
                        {'name': 'admin', 'desc': 'Administrator role'},
                        {'name': 'student', 'desc': 'Student developer'}
                    ]
                    
                    created_roles = []
                    for role_data in roles_to_create:
                        existing_role = Role.query.filter_by(name=role_data['name']).first()
                        if not existing_role:
                            new_role = Role(name=role_data['name'], desc=role_data['desc'])
                            db.session.add(new_role)
                            created_roles.append(role_data['name'])
                    
                    if created_roles:
                        db.session.commit()
                        print(f"✅ Created roles: {', '.join(created_roles)}")
                    else:
                        print("ℹ️ Default roles already exist")
                    
                    print("ℹ️ Admin users must be created through Firebase Console and then registered via the app")
                else:
                    print("⚠️ Database tables don't exist yet.")
                    print("Run 'flask db init', 'flask db migrate', and 'flask db upgrade' to set up the database.")
            except Exception as e:
                print(f"⚠️ Database not ready: {e}")
                print("Run 'flask db init', 'flask db migrate', and 'flask db upgrade' to set up the database.")
    
    # Setup roles in background to avoid blocking server startup
    import threading
    threading.Thread(target=setup_default_roles, daemon=True).start()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
