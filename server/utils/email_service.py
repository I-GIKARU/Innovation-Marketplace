from flask_mail import Mail, Message
from flask import current_app
from jinja2 import Template
from datetime import datetime

# Initialize Flask-Mail instance
mail = Mail()

def init_mail(app):
    """Initialize Flask-Mail with the app"""
    mail.init_app(app)

def send_order_confirmation_email(order_data):
    """
    Send order confirmation email to customer immediately after order creation
    
    Args:
        order_data (dict): Order information containing:
            - email: Customer email
            - sale_id: Order ID
            - amount: Total amount
            - items: List of ordered items with details
            - status: Order status
    """
    try:
        # Create email message
        msg = Message(
            subject=f"Order Confirmation - #{order_data['sale_id']} - Innovation Marketplace",
            sender=current_app.config.get('MAIL_DEFAULT_SENDER', 'noreply@innovationmarketplace.com'),
            recipients=[order_data['email']]
        )
        
        # Generate HTML email content
        html_content = generate_order_email_html(order_data)
        msg.html = html_content
        
        # Generate plain text content
        text_content = generate_order_email_text(order_data)
        msg.body = text_content
        
        # Send email
        mail.send(msg)
        
        print(f"✅ Order confirmation email sent to {order_data['email']} for order #{order_data['sale_id']}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send order confirmation email: {str(e)}")
        return False

def generate_order_email_html(order_data):
    """Generate HTML email template for order confirmation"""
    
    html_template = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                padding-bottom: 25px;
                border-bottom: 3px solid #0a1128;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #0a1128;
                margin: 0;
                font-size: 28px;
            }
            .header p {
                color: #666;
                margin: 10px 0 0 0;
                font-size: 16px;
            }
            .order-info {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                padding: 25px;
                border-radius: 8px;
                margin-bottom: 30px;
                border-left: 4px solid #0a1128;
            }
            .order-info h2 {
                color: #0a1128;
                margin-top: 0;
                font-size: 20px;
            }
            .order-info p {
                margin: 8px 0;
                font-size: 15px;
            }
            .items-section {
                margin-bottom: 30px;
            }
            .items-section h3 {
                color: #0a1128;
                font-size: 18px;
                margin-bottom: 15px;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .items-table th,
            .items-table td {
                padding: 15px 12px;
                text-align: left;
                border-bottom: 1px solid #dee2e6;
            }
            .items-table th {
                background-color: #0a1128;
                color: white;
                font-weight: 600;
                text-transform: uppercase;
                font-size: 12px;
                letter-spacing: 0.5px;
            }
            .items-table tbody tr:hover {
                background-color: #f8f9fa;
            }
            .total-row {
                font-weight: bold;
                background-color: #e9ecef;
                font-size: 16px;
            }
            .total-row td {
                border-bottom: none;
                padding: 20px 12px;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 25px;
                border-top: 2px solid #dee2e6;
                color: #666;
            }
            .footer p {
                margin: 10px 0;
            }
            .status-badge {
                display: inline-block;
                padding: 6px 16px;
                background-color: #28a745;
                color: white;
                border-radius: 25px;
                font-size: 11px;
                text-transform: uppercase;
                font-weight: 600;
                letter-spacing: 0.5px;
            }
            .highlight {
                color: #0a1128;
                font-weight: 600;
            }
            .amount-highlight {
                color: #28a745;
                font-size: 18px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Order Confirmed!</h1>
                <p>Thank you for your purchase from Innovation Marketplace</p>
            </div>
            
            <div class="order-info">
                <h2>📋 Order Summary</h2>
                <p><span class="highlight">Order ID:</span> #{{ sale_id }}</p>
                <p><span class="highlight">Order Date:</span> {{ order_date }}</p>
                <p><span class="highlight">Status:</span> <span class="status-badge">{{ status }}</span></p>
                <p><span class="highlight">Customer Email:</span> {{ email }}</p>
            </div>
            
            <div class="items-section">
                <h3>🛒 Items Ordered</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {% for item in items %}
                        <tr>
                            <td><strong>{{ item.name }}</strong></td>
                            <td>{{ item.quantity }}</td>
                            <td>KES {{ "{:,.2f}".format(item.price) }}</td>
                            <td>KES {{ "{:,.2f}".format(item.price * item.quantity) }}</td>
                        </tr>
                        {% endfor %}
                        <tr class="total-row">
                            <td colspan="3"><strong>🎯 TOTAL AMOUNT</strong></td>
                            <td><span class="amount-highlight">KES {{ "{:,.2f}".format(amount) }}</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
                <p style="margin: 0; color: #1976d2;"><strong>📧 What's Next?</strong></p>
                <p style="margin: 5px 0 0 0; color: #424242;">Keep this email for your records. If you made a payment, it will be processed shortly. For any questions about your order, feel free to contact us.</p>
            </div>
            
            <div class="footer">
                <p><strong>Thank you for choosing Innovation Marketplace! 🚀</strong></p>
                <p>Empowering student innovation, one order at a time.</p>
                <p style="font-size: 12px; color: #999; margin-top: 20px;">
                    This is an automated confirmation email. Please do not reply directly to this message.
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    template = Template(html_template)
    
    # Prepare template data
    template_data = {
        'sale_id': order_data['sale_id'],
        'email': order_data['email'],
        'amount': order_data['amount'],
        'items': order_data.get('items', []),
        'order_date': datetime.now().strftime('%B %d, %Y at %I:%M %p'),
        'status': order_data.get('status', 'Completed').title()
    }
    
    return template.render(**template_data)

def generate_order_email_text(order_data):
    """Generate plain text email for order confirmation"""
    
    text_template = """
🎉 ORDER CONFIRMATION - #{sale_id}

Thank you for your purchase from Innovation Marketplace!

📋 ORDER DETAILS:
Order ID: #{sale_id}
Order Date: {order_date}
Status: {status}
Customer Email: {email}

🛒 ITEMS ORDERED:
{items_list}

🎯 TOTAL AMOUNT: KES {amount:,.2f}

📧 WHAT'S NEXT?
Keep this email for your records. If you made a payment, it will be processed shortly. 
For any questions about your order, feel free to contact us.

Thank you for choosing Innovation Marketplace! 🚀
Empowering student innovation, one order at a time.

---
This is an automated confirmation email. Please do not reply directly to this message.
    """
    
    # Format items list
    items_list = ""
    for item in order_data.get('items', []):
        item_total = item['price'] * item['quantity']
        items_list += f"• {item['name']} x{item['quantity']} - KES {item['price']:,.2f} each = KES {item_total:,.2f}\n"
    
    return text_template.format(
        sale_id=order_data['sale_id'],
        email=order_data['email'],
        amount=order_data['amount'],
        items_list=items_list.strip(),
        order_date=datetime.now().strftime('%B %d, %Y at %I:%M %p'),
        status=order_data.get('status', 'Completed').title()
    )
