import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from dotenv import load_dotenv
from config import Config
from models import db, bcrypt, Admin

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

    from resources import auth, merchandise, orders
    auth.setup_routes(api)
    merchandise.setup_routes(api)
    orders.setup_routes(api)

    # ✅ Create default admin immediately in app context
    with app.app_context():
        try:
            # Check if tables exist before querying
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            if 'admins' in inspector.get_table_names():
                if not Admin.query.first():
                    admin_email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@example.com")
                    admin_password = os.getenv("DEFAULT_ADMIN_PASSWORD", "StrongPass123!")
                    admin_name = os.getenv("DEFAULT_ADMIN_NAME", "Super Admin")

                    print("⚠️ No admin found — creating default admin...")
                    admin = Admin(name=admin_name, email=admin_email)
                    admin.set_password(admin_password)
                    db.session.add(admin)
                    db.session.commit()
                    print(f"✅ Admin created: {admin_email}")
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
