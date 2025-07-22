from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from . import db

class Role(db.Model, SerializerMixin):
    __tablename__ = 'roles'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    desc = db.Column(db.String(255))
    
    # Relationships
    users = db.relationship('User', back_populates='role', lazy=True)

    # Serialization rules
    serialize_rules = ('-users.role',)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    firebase_uid = db.Column(db.String(128), unique=True, nullable=False)  # Store Firebase UID
    auth_provider = db.Column(db.String(20), default='firebase')  # Only Firebase auth
    bio = db.Column(db.Text)
    socials = db.Column(db.String(255))
    company = db.Column(db.String(100))
    past_projects = db.Column(db.Text)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    
    # Relationships
    orders = db.relationship('Order', back_populates='user', lazy=True)
    user_projects = db.relationship('UserProject', back_populates='user', lazy=True)
    role = db.relationship('Role', back_populates='users')

    # Serialization rules
    serialize_rules = ('-role.users', '-orders.user', '-user_projects.user')



class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    
    projects = db.relationship('Project', back_populates='category')
    
    # Don't include projects in category serialization to avoid data mixup
    serialize_rules = ('-projects',)

class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    tech_stack = db.Column(db.String(255))
    github_link = db.Column(db.String(255))
    demo_link = db.Column(db.String(255))
    is_for_sale = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(50))
    featured = db.Column(db.Boolean, default=False)
    technical_mentor = db.Column(db.String(100))
    views = db.Column( db.Integer, default=0)
    clicks = db.Column(db.Integer, default=0)
    downloads = db.Column(db.Integer, default=0)
    
    # Media fields
    image_urls = db.Column(db.Text)  # JSON string of image URLs
    video_urls = db.Column(db.Text)  # JSON string of video URLs
    thumbnail_url = db.Column(db.String(500))  # Main project thumbnail
    
    # Relationships
    category = db.relationship('Category', back_populates='projects')
    user_projects = db.relationship('UserProject', back_populates='project', lazy=True)
    
    # Serialization rules
    serialize_rules = ('-category.projects', '-user_projects.project')
    
    
  
class UserProject(db.Model, SerializerMixin):
    __tablename__ = 'users_projects'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    interested_in = db.Column(db.String(255))
    date = db.Column(db.Date)
    message = db.Column(db.Text)
    
    # Relationships
    user = db.relationship('User', back_populates='user_projects')
    project = db.relationship('Project', back_populates='user_projects')
    
    reviews = db.relationship('Review', back_populates='user_project', lazy=True)

    # Serialization rules
    serialize_rules = ('-user.user_projects', '-project.user_projects', '-reviews.user_project')
    

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_project_id = db.Column(db.Integer, db.ForeignKey('users_projects.id'), nullable=False)
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    date = db.Column(db.Date)
    
    # Relationships
    user_project = db.relationship('UserProject', back_populates='reviews')

    # Serialization rules
    serialize_rules = ('-user_project.reviews',)
