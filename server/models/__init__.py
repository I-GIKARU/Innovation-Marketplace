from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt


db = SQLAlchemy()
bcrypt = Bcrypt()


from .merchandise import User, Merchandise, OrderItem, Order, Payment
from .projects import Student, Admin, Client, Category, Project, ProjectStudent, ClientInterest, Review

__all__ = [
    'db', 'bcrypt',
    'User', 'Merchandise', 'OrderItem', 'Order', 'Payment',
    'Student', 'Admin', 'Client', 'Category', 'Project', 
    'ProjectStudent', 'ClientInterest', 'Review'
]