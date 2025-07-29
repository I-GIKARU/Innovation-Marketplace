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
    views = db.Column(db.Integer, default=0)
    clicks = db.Column(db.Integer, default=0)
    downloads = db.Column(db.Integer, default=0)
    rejection_reason = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Media fields
    zip_urls = db.Column(db.Text)  # JSON string of ZIP file URLs
    pdf_urls = db.Column(db.Text)  # JSON string of PDF file URLs  
    video_urls = db.Column(db.Text)  # JSON string of video URLs
    thumbnail_url = db.Column(db.String(500))  # Main project thumbnail
    
    # External collaborators (unregistered users)
    external_collaborators = db.Column(db.Text)  # JSON string of external collaborators with name and github
    
    # Relationships
    category = db.relationship('Category', back_populates='projects')
    user_projects = db.relationship('UserProject', back_populates='project', lazy=True)
    
    # Serialization rules
    serialize_rules = ('-category.projects', '-user_projects.project')
    
    def to_dict(self):
        """Custom to_dict method that includes user_projects (collaborators) and external collaborators"""
        import json
        # Parse external collaborators
        external_collabs = []
        if self.external_collaborators:
            try:
                external_collabs = json.loads(self.external_collaborators)
            except (json.JSONDecodeError, TypeError):
                external_collabs = []

        result = {
            'id': self.id,
            'category_id': self.category_id,
            'title': self.title,
            'description': self.description,
            'tech_stack': self.tech_stack,
            'github_link': self.github_link,
            'demo_link': self.demo_link,
            'is_for_sale': self.is_for_sale,
            'status': self.status,
            'featured': self.featured,
            'technical_mentor': self.technical_mentor,
            'views': self.views,
            'clicks': self.clicks,
            'downloads': self.downloads,
            'rejection_reason': self.rejection_reason,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'zip_urls': self.zip_urls,
            'pdf_urls': self.pdf_urls,
            'video_urls': self.video_urls,
            'thumbnail_url': self.thumbnail_url,
            'category': self.category.to_dict() if self.category else None,
            'user_projects': [up.to_dict() for up in self.user_projects] if self.user_projects else [],
            'external_collaborators': external_collabs,
            'reviews': [review.to_dict() for review in self.reviews] if hasattr(self, 'reviews') and self.reviews else []
        }
        return result

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
    contributions = db.relationship('Contribution', back_populates='user_project', cascade='all, delete-orphan')
    
    # Serialization rules
    serialize_rules = ('-user.user_projects', '-project.user_projects', '-contributions.user_project')
    
    def to_dict(self):
        """Custom to_dict method that includes user information and contributions"""
        result = {
            'id': self.id,
            'user_id': self.user_id,
            'project_id': self.project_id,
            'interested_in': self.interested_in,
            'date': self.date.isoformat() if self.date else None,
            'message': self.message,
            'user': self.user.to_dict() if self.user else None,
            'contributions': [contribution.to_dict() for contribution in self.contributions] if self.contributions else []
        }
        return result

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    date = db.Column(db.Date, default=datetime.utcnow().date)
    
    # Relationships
    project = db.relationship('Project', backref='reviews')
    user = db.relationship('User', backref='reviews')
    
    # Serialization rules
    serialize_rules = ('-project.reviews', '-user.reviews')

class Contribution(db.Model, SerializerMixin):
    __tablename__ = 'contributions'
    
    id = db.Column(db.Integer, primary_key=True)
    users_projects_id = db.Column(db.Integer, db.ForeignKey('users_projects.id'), nullable=False)
    amount = db.Column(db.Float)
    date = db.Column(db.Date, default=datetime.utcnow().date)
    comment = db.Column(db.Text)
    
    # Relationships
    user_project = db.relationship('UserProject', back_populates='contributions')
    
    # Serialization rules
    serialize_rules = ('-user_project.contributions',)
    
    def to_dict(self):
        result = {
            'id': self.id,
            'users_projects_id': self.users_projects_id,
            'amount': self.amount,
            'date': self.date.isoformat() if self.date else None,
            'comment': self.comment,
            'user_project': {
                'id': self.user_project.id,
                'user': self.user_project.user.to_dict() if self.user_project.user else None,
                'project': {
                    'id': self.user_project.project.id,
                    'title': self.user_project.project.title
                } if self.user_project.project else None
            } if self.user_project else None
        }
        return result
