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

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
