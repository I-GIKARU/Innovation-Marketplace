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

class Admin(db.Model, SerializerMixin):
    __tablename__ = 'admins'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    reviewed_projects = db.relationship('Project', back_populates='reviewer')
    
    serialize_rules = ('-password_hash', '-reviewed_projects.reviewer',)
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    company = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    
    interests = db.relationship('ClientInterest', back_populates='client')
    orders = db.relationship('Order', back_populates='client')
    
    serialize_rules = ('-password_hash', '-interests.client', '-orders.client',)
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    reviewed_by = db.Column(db.Integer, db.ForeignKey('admins.id'))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    tech_stack = db.Column(db.String(255))
    github_link = db.Column(db.String(255))
    demo_link = db.Column(db.String(255))
    is_for_sale = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(50))
    price = db.Column(db.Integer)
    is_approved = db.Column(db.Boolean, default=False)
    featured = db.Column(db.Boolean, default=False)
    views = db.Column(db.Integer, default=0)
    clicks = db.Column(db.Integer, default=0)
    downloads = db.Column(db.Integer, default=0)
    
    category = db.relationship('Category', back_populates='projects')
    reviewer = db.relationship('Admin', back_populates='reviewed_projects')
    students = db.relationship('ProjectStudent', back_populates='project')
    reviews = db.relationship('Review', back_populates='project')
    client_interests = db.relationship('ClientInterest', back_populates='project')
    
    serialize_rules = (
        '-category.projects',
        '-reviewer.reviewed_projects',
        '-students.project',
        '-reviews.project',
        '-client_interests.project'
    )
