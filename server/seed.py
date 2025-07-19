import random
from datetime import datetime, timedelta
from faker import Faker
from werkzeug.security import generate_password_hash

def seed_database():
    # Import inside function to avoid circular imports
    from app import create_app
    app = create_app()
    
    with app.app_context():
        # Import models after app context is established
        from models import (
            db, bcrypt,
            Role, User, Category, Project,
            Merchandise, UserProject, Order,
            OrderItem, Payment, Review
        )

        print("\n=== Resetting Database ===")
        db.drop_all()
        db.create_all()
        print("✓ Database reset complete\n")
        
        print("=== Seeding Database ===")
        
        # Create roles
        roles = [
            Role(name='admin', desc='Administrator role'),
            Role(name='student', desc='Student developer'),
            Role(name='client', desc='Project client')
        ]
        db.session.add_all(roles)
        db.session.commit()
        print("✓ Created roles")
        
        # Get role instances
        role_admin = Role.query.filter_by(name='admin').first()
        role_student = Role.query.filter_by(name='student').first()
        role_client = Role.query.filter_by(name='client').first()
        
        # Create test users
        users = [
            User(
                email='admin@example.com',
                phone='+1000000000',
                password_hash=bcrypt.generate_password_hash('admin123').decode('utf-8'),
                bio='System Administrator',
                role_id=role_admin.id
            ),
            User(
                email='student@example.com',
                phone='+1000000001',
                password_hash=bcrypt.generate_password_hash('student123').decode('utf-8'),
                bio='Computer Science Student',
                role_id=role_student.id
            ),
            User(
                email='client@example.com',
                phone='+1000000002',
                password_hash=bcrypt.generate_password_hash('client123').decode('utf-8'),
                bio='Business Owner',
                company='Test Company Inc.',
                role_id=role_client.id
            )
        ]
        
        # Create additional random users
        for _ in range(12):
            role = random.choice([role_student, role_client])
            users.append(User(
                email=fake.unique.email(),
                phone=fake.phone_number(),
                password_hash=bcrypt.generate_password_hash('password123').decode('utf-8'),
                bio=fake.text(),
                socials=fake.url(),
                company=fake.company() if role == role_client and random.random() > 0.5 else None,
                past_projects=fake.text() if random.random() > 0.5 else None,
                role_id=role.id
            ))
        
        db.session.add_all(users)
        db.session.commit()
        print("✓ Created users")
        
        # Create categories
        categories = [
            Category(name='Web Development', description='Full-stack web applications'),
            Category(name='Mobile Apps', description='iOS and Android applications'),
            Category(name='Data Science', description='ML models and data analysis'),
            Category(name='DevOps', description='Cloud infrastructure and CI/CD'),
            Category(name='UI/UX Design', description='User interface design')
        ]
        db.session.add_all(categories)
        db.session.commit()
        print("✓ Created categories")
        
        # Create projects
        projects = []
        tech_stacks = [
            "Python, Django, PostgreSQL",
            "JavaScript, React, Node.js",
            "Swift, iOS SDK",
            "Kotlin, Android SDK",
            "Python, TensorFlow, PyTorch",
            "Docker, Kubernetes, AWS"
        ]
        
        for _ in range(20):
            projects.append(Project(
                category_id=random.choice(categories).id,
                title=fake.catch_phrase(),
                description='\n'.join(fake.paragraphs(3)),
                tech_stack=random.choice(tech_stacks),
                github_link=fake.url() if random.random() > 0.3 else None,
                demo_link=fake.url() if random.random() > 0.5 else None,
                is_for_sale=random.random() > 0.7,
                status=random.choice(['active', 'completed', 'archived']),
                featured=random.random() > 0.8,
                technical_mentor=fake.name(),
                views=random.randint(0, 1000),
                clicks=random.randint(0, 500),
                downloads=random.randint(0, 200)
            ))
        
        db.session.add_all(projects)
        db.session.commit()
        print("✓ Created projects")
        
        # (merchandise, project participants, orders, payments, reviews)
        
        print("\n✓ Database seeding complete!")

if __name__ == '__main__':
    fake = Faker()
    seed_database()