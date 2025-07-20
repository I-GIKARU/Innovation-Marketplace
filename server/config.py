import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # General App Config
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///moringa_marketplace.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # JWT Cookie settings - matching working config
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SECURE = os.getenv('JWT_COOKIE_SECURE', 'false').lower() == 'true'
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_SAMESITE = 'Lax'
    JWT_ACCESS_COOKIE_NAME = 'access_token'
    JWT_COOKIE_CSRF_PROTECT = False  # Disable CSRF protection for simplicity

    # Custom domain validation
    STUDENT_EMAIL_DOMAIN = '@student.moringaschool.com'
