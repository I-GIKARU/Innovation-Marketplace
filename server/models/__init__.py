from flask_sqlalchemy import SQLAlchemy
from .projects import Role, User, Category, Project, UserProject, Review, Contribution
from .merchandise import Merchandise, Order, OrderItem, Payment

db = SQLAlchemy()

__all__ = [
    'db',
    'Role',
    'User',
    'Category',
    'Project',
    'UserProject',
    'Review',
    'Contribution',
    'Merchandise',
    'Order',
    'OrderItem',
    'Payment'
]
