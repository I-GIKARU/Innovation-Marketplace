from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from config import Config
from models import db, bcrypt


jwt = JWTManager()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    api = Api(app)

    from models.merchandise import Merchandise
    from models.projects import Project
    
    with app.app_context():
        db.create_all()
        print("Database tables created!")
    return app
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
