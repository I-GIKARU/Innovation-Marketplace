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

    # JWT via cookies
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SECURE = False               # Set True in production with HTTPS
    JWT_COOKIE_SAMESITE = 'Lax'             # 'Strict' or 'None' depending on cross-site needs
    JWT_ACCESS_COOKIE_PATH = '/'
    JWT_COOKIE_CSRF_PROTECT = False         # Enable and use CSRF tokens in production
    JWT_SESSION_COOKIE = True

    # Custom domain validation
    STUDENT_EMAIL_DOMAIN = '@student.moringaschool.com'
