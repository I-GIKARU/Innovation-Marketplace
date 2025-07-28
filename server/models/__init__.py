from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()



from .projects import Role, User, Category, Project, UserProject, Review
from .merchandise import  Merchandise, SalesItem, Sales, Payment
__all__ = [
    'db',
    'Role',
    'User',
    'Category',
    'Project',
    'UserProject',
    'Review',
    'Merchandise',
    'Sales',
    'SalesItem',
    'Payment'
]
