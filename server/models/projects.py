from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from . import db,bcrypt





class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    
    projects = db.relationship('Project', back_populates='category')
    
    serialize_rules = ('-projects.category',)

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
    views = db.Column(db.Integer, default=0)
    clicks = db.Column(db.Integer, default=0)
    downloads = db.Column(db.Integer, default=0)
    
    # Relationships
    user_projects = db.relationship('UserProject', backref='project', lazy=True)
    
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
    reviews = db.relationship('Review', backref='user_project', lazy=True)
    
    # Serialization rules
    serialize_rules = ('-user.user_projects', '-project.user_projects', '-reviews.user_project')
    

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_project_id = db.Column(db.Integer, db.ForeignKey('users_projects.id'), nullable=False)
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    date = db.Column(db.Date)
    
    # Serialization rules
    serialize_rules = ('-user_project.reviews',)
