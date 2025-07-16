from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(128))
    
    serialize_rules = ('-password_hash',)  # exclude password from serialization
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class Merchandise(db.Model, SerializerMixin):
    __tablename__ = 'merchandise'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Integer)
    image_url = db.Column(db.String(255))
    is_in_stock = db.Column(db.Boolean, default=True)

    order_items = db.relationship('OrderItem', back_populates='merchandise')

    serialize_rules = ('-order_items.merchandise',)


class OrderItem(db.Model, SerializerMixin):
    __tablename__ = 'order_item'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    merchandise_id = db.Column(db.Integer, db.ForeignKey('merchandise.id'))
    quantity = db.Column(db.Integer)
    price = db.Column(db.Integer)

    order = db.relationship('Order', back_populates='items')
    merchandise = db.relationship('Merchandise', back_populates='order_items')

    serialize_rules = ('-order.items', '-merchandise.order_items',)


class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    date = db.Column(db.Date, default=datetime.utcnow)
    status = db.Column(db.String(50))
    amount = db.Column(db.Integer)

    client = db.relationship('Client', back_populates='orders')
    items = db.relationship('OrderItem', back_populates='order')
    payment = db.relationship('Payment', back_populates='order', uselist=False)

    serialize_rules = ('-client.orders', '-items.order', '-payment.order',)


class Payment(db.Model, SerializerMixin):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    method = db.Column(db.String(50))
    amount = db.Column(db.Integer)
    status = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    order = db.relationship('Order', back_populates='payment')

    serialize_rules = ('-order.payment',)