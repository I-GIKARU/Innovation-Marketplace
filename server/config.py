import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Main configs
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///moringa_marketplace.db')
    
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # Student domain
    STUDENT_EMAIL_DOMAIN = '@student.moringaschool.com'

