from datetime import datetime, timezone
from sqlalchemy_serializer import SerializerMixin
from . import db,bcrypt





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
    email = db.Column(db.String(120), nullable=True)
    date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    status = db.Column(db.String(50))
    amount = db.Column(db.Integer)

    buyer = db.relationship('User', back_populates='orders')
    items = db.relationship('OrderItem', back_populates='order')
    payment = db.relationship('Payment', back_populates='order', uselist=False)

    serialize_rules = ('-buyer.orders', '-items.order', '-payment.order',)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "email": self.email if self.user_id is None else None,
            "buyer": self.buyer.to_dict() if self.buyer else None,
            "amount": self.amount,
            "status": self.status,
            "date": self.date.isoformat(),
            "items": [item.to_dict() for item in self.items],
            "payment": self.payment.to_dict() if self.payment else None
        }


class Payment(db.Model, SerializerMixin):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    method = db.Column(db.String(50))
    amount = db.Column(db.Integer)
    status = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    order = db.relationship('Order', back_populates='payment')

    serialize_rules = ('-order.payment',)