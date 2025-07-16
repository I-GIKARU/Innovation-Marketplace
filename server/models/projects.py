from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class Student(db.Model, SerializerMixin):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.Text)
    skills = db.Column(db.String(255))
    github_link = db.Column(db.String(255))
    linkedin_link = db.Column(db.String(255))
    past_projects = db.Column(db.Text)
    
    projects = db.relationship('ProjectStudent', back_populates='student')
    
    serialize_rules = ('-password_hash', '-projects.student',)
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)