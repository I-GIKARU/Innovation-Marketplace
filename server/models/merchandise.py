from datetime import datetime, timezone
from sqlalchemy_serializer import SerializerMixin
from . import db

class Merchandise(db.Model, SerializerMixin):
    __tablename__ = 'merchandise'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Integer)
    quantity = db.Column(db.Integer, default=0)  # Stock quantity
    image_url = db.Column(db.String(255))  # Keep for backward compatibility
    image_urls = db.Column(db.Text)  # JSON string of multiple image URLs
    thumbnail_url = db.Column(db.String(500))  # Main product image

    sales_items = db.relationship('SalesItem', back_populates='merchandise')

    serialize_rules = ('-sales_items.merchandise',)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'quantity': self.quantity,
            'image_url': self.image_url,
            'image_urls': self.image_urls,
            'thumbnail_url': self.thumbnail_url
        }


class SalesItem(db.Model, SerializerMixin):
    __tablename__ = 'sales_item'

    id = db.Column(db.Integer, primary_key=True)
    sales_id = db.Column(db.Integer, db.ForeignKey('sales.id'))
    merchandise_id = db.Column(db.Integer, db.ForeignKey('merchandise.id'))
    quantity = db.Column(db.Integer)
    price = db.Column(db.Integer)

    sales = db.relationship('Sales', back_populates='items')
    merchandise = db.relationship('Merchandise', back_populates='sales_items')

    serialize_rules = ('-sales.items', '-merchandise.sales_items',)
    
    def to_dict(self):
        return {
            'id': self.id,
            'sales_id': self.sales_id,
            'merchandise_id': self.merchandise_id,
            'quantity': self.quantity,
            'price': self.price,
            'merchandise': self.merchandise.to_dict() if self.merchandise else None
        }


class Sales(db.Model, SerializerMixin):
    __tablename__ = 'sales'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    email = db.Column(db.String(120), nullable=True)
    date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    status = db.Column(db.String(50))
    amount = db.Column(db.Integer)
    hidden_from_user = db.Column(db.Boolean, default=False)  # Soft delete for user view
    

    user = db.relationship('User', back_populates='sales')
    items = db.relationship('SalesItem', back_populates='sales')
    payment = db.relationship('Payment', back_populates='sales', uselist=False)

    serialize_rules = ('-user.sales', '-items.sales', '-payment.sales',)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "email": self.email if self.user_id is None else None,
            "user": self.user.to_dict() if self.user else None,
            "amount": self.amount,
            "status": self.status,
            "date": self.date.isoformat(),
            "items": [item.to_dict() for item in self.items],
            "payment": self.payment.to_dict() if self.payment else None
        }


class Payment(db.Model, SerializerMixin):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    sales_id = db.Column(db.Integer, db.ForeignKey('sales.id'))
    method = db.Column(db.String(50))
    amount = db.Column(db.Integer)
    status = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    sales = db.relationship('Sales', back_populates='payment')

    serialize_rules = ('-sales.payment',)
