import os
import random
from datetime import datetime, timedelta
from faker import Faker
from werkzeug.security import generate_password_hash

from app import create_app
app = create_app()

# Import models after app is created
from models import db, bcrypt
from models.merchandise import User, Merchandise, OrderItem, Order, Payment
from models.projects import Student, Admin, Client, Category, Project, ProjectStudent, ClientInterest, Review

# Initialize Faker for fake data generation
fake = Faker()

def recreate_database():
    """Drop and recreate all database tables"""
    print("Recreating database tables...")
    db.drop_all()
    db.create_all()
    print("Database recreated successfully.")

def seed_project_users():
    """Seed all user types (students, admins, clients)"""
    print("Seeding users...")
    
    # Seed Students
    students = []
    for _ in range(20):
        student = Student(
            name=fake.name(),
            email=fake.unique.email(),
            password_hash=generate_password_hash("student123"),
            bio=fake.paragraph(),
            skills=", ".join(fake.words(5)),
            github_link=f"https://github.com/{fake.user_name()}",
            linkedin_link=f"https://linkedin.com/in/{fake.user_name()}",
            past_projects=fake.paragraph()
        )
        db.session.add(student)
        students.append(student)
    
    # Seed Admins
    admins = []
    for i in range(3):
        admin = Admin(
            name=fake.name(),
            email=f"admin{i+1}@example.com",
            password_hash=generate_password_hash("admin123")
        )
        db.session.add(admin)
        admins.append(admin)
    
    # Seed Clients
    clients = []
    for _ in range(10):
        client = Client(
            name=fake.name(),
            email=fake.unique.email(),
            password_hash=generate_password_hash("client123"),
            company=fake.company(),
            phone=fake.phone_number()
        )
        db.session.add(client)
        clients.append(client)
    
    db.session.commit()
    print("Users seeded successfully.")
    return students, admins, clients

def seed_categories():
    """Seed project categories"""
    print("Seeding categories...")
    
    categories = [
        ("Web Development", "Projects related to website and web application development"),
        ("Mobile Apps", "iOS and Android mobile applications"),
        ("Data Science", "Machine learning, AI, and data analysis projects"),
        ("Game Development", "Video game projects"),
        ("IoT", "Internet of Things and hardware projects"),
        ("UI/UX Design", "User interface and experience design projects")
    ]
    
    category_objects = []
    for name, desc in categories:
        category = Category(
            name=name,
            description=desc
        )
        db.session.add(category)
        category_objects.append(category)
    
    db.session.commit()
    print("Categories seeded successfully.")
    return category_objects

def seed_projects(categories, students, admins, count=30):
    """Seed projects with relationships"""
    print(f"Seeding {count} projects...")
    
    statuses = ["Draft", "In Progress", "Completed", "Published"]
    tech_stacks = [
        "Python, Flask, PostgreSQL",
        "JavaScript, React, Node.js",
        "Java, Spring Boot, MySQL",
        "Swift, iOS SDK",
        "Python, TensorFlow, PyTorch",
        "C#, Unity",
        "JavaScript, Three.js",
        "Python, Django, PostgreSQL"
    ]
    
    projects = []
    for _ in range(count):
        project = Project(
            title=fake.catch_phrase(),
            description=fake.paragraph(5),
            tech_stack=random.choice(tech_stacks),
            github_link=f"https://github.com/{fake.user_name()}/{fake.word()}",
            demo_link=f"https://demo.{fake.domain_name()}",
            is_for_sale=random.choice([True, False]),
            status=random.choice(statuses),
            price=random.choice([0, 5000, 10000, 15000, 20000]),
            is_approved=random.choice([True, False]),
            featured=random.choice([True, False]),
            views=random.randint(0, 1000),
            clicks=random.randint(0, 500),
            downloads=random.randint(0, 200),
            category_id=random.choice(categories).id,
            reviewed_by=random.choice(admins).id if random.choice([True, False]) else None
        )
        db.session.add(project)
        projects.append(project)
    
    db.session.commit()
    
    # Assign students to projects
    for project in projects:
        num_students = random.randint(1, 4)
        for student in random.sample(students, num_students):
            db.session.add(ProjectStudent(
                student_id=student.id,
                project_id=project.id
            ))
    
    db.session.commit()
    print("Projects seeded successfully.")
    return projects

def seed_client_interests(clients, projects, count=50):
    """Seed client interests in projects"""
    print(f"Seeding {count} client interests...")
    
    interests = ["buying", "hiring", "collaboration", "consulting"]
    
    for _ in range(count):
        interest = ClientInterest(
            project_id=random.choice(projects).id,
            client_id=random.choice(clients).id,
            interested_in=random.choice(interests),
            message=fake.paragraph(),
            date=fake.date_between(start_date='-1y', end_date='today')
        )
        db.session.add(interest)
    
    db.session.commit()
    print("Client interests seeded successfully.")

def seed_reviews(projects, count=40):
    """Seed project reviews"""
    print(f"Seeding {count} reviews...")
    
    for _ in range(count):
        review = Review(
            project_id=random.choice(projects).id,
            rating=random.randint(1, 5),
            comment=fake.paragraph(),
            date=fake.date_between(start_date='-1y', end_date='today')
        )
        db.session.add(review)
    
    db.session.commit()
    print("Reviews seeded successfully.")


######merchandise_seed######
def seed_merch_users(count=10):
    """Seed users table with fake data"""
    print(f"Seeding {count} users...")
    
    # Create admin user
    admin = User(
        email="admin@example.com",
        phone=fake.phone_number(),
        password_hash=generate_password_hash("admin123")
    )
    db.session.add(admin)
    
    # Create regular users
    for _ in range(count - 1):
        user = User(
            email=fake.unique.email(),
            phone=fake.phone_number(),
            password_hash=generate_password_hash(fake.password())
        )
        db.session.add(user)
    
    db.session.commit()
    print("Users seeded successfully.")
    return User.query.all()

def seed_merchandise(count=20):
    """Seed merchandise table"""
    print(f"Seeding {count} merchandise items...")
    
    categories = ["T-Shirts", "Hoodies", "Hats", "Posters", "Stickers", "Mugs"]
    
    for _ in range(count):
        merch = Merchandise(
            name=f"{random.choice(categories)} - {fake.word().capitalize()}",
            description=fake.sentence(),
            price=random.randint(5, 50) * 100,  # Prices in cents
            image_url=fake.image_url(width=400, height=400),
            is_in_stock=random.choice([True, False])
        )
        db.session.add(merch)
    
    db.session.commit()
    print("Merchandise seeded successfully.")
    return Merchandise.query.all()

def seed_orders(users, count=15):
    """Seed orders table"""
    print(f"Seeding {count} orders...")
    
    statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
    
    for _ in range(count):
        order = Order(
            user_id=random.choice(users).id,
            date=fake.date_between(start_date='-1y', end_date='today'),
            status=random.choice(statuses),
            amount=0  # Will be calculated when adding items
        )
        db.session.add(order)
    
    db.session.commit()
    print("Orders seeded successfully.")
    return Order.query.all()

def seed_order_items(orders, merchandise, count=50):
    """Seed order items"""
    print(f"Seeding {count} order items...")
    
    for order in orders:
        # Add 1-5 items to each order
        num_items = random.randint(1, 5)
        order_total = 0
        
        for _ in range(num_items):
            merch = random.choice(merchandise)
            quantity = random.randint(1, 3)
            item_price = merch.price
            
            item = OrderItem(
                order_id=order.id,
                merchandise_id=merch.id,
                quantity=quantity,
                price=item_price
            )
            db.session.add(item)
            order_total += item_price * quantity
        
        # Update order total
        order.amount = order_total
    
    db.session.commit()
    print("Order items seeded successfully.")

def seed_payments(orders, count=10):
    """Seed payments table"""
    print(f"Seeding {count} payments...")
    
    methods = ["Credit Card", "PayPal", "Bank Transfer", "Cash on Delivery"]
    statuses = ["Pending", "Completed", "Failed", "Refunded"]
    
    for order in random.sample(orders, min(count, len(orders))):
        payment = Payment(
            order_id=order.id,
            method=random.choice(methods),
            amount=order.amount,
            status=random.choice(statuses),
            timestamp=fake.date_time_between(
                start_date=order.date,
                end_date=order.date + timedelta(days=3)
            )
        )
        db.session.add(payment)
    
    db.session.commit()
    print("Payments seeded successfully.")

def main():
    """Main seeding function"""
    print("Starting database seeding...")
    
    recreate_database()
    students, admins, clients = seed_project_users()
    categories = seed_categories()
    projects = seed_projects(categories, students, admins)
    seed_client_interests(clients, projects)
    seed_reviews(projects)



    merch_users = seed_merch_users()
    merchandise = seed_merchandise()
    orders = seed_orders(merch_users)
    seed_order_items(orders, merchandise)
    seed_payments(orders)
    
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    from app import create_app
    app = create_app()
    with app.app_context():
        main()