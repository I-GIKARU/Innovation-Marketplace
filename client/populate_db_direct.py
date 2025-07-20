#!/usr/bin/env python3
import sys
import os
sys.path.append('../server')

# Import the Flask app and models
from app import create_app
from models import db, User, Role, Project, Category
from werkzeug.security import generate_password_hash
import random
from datetime import datetime

# Configuration
IMAGE_URL = "https://images.pexels.com/photos/32980837/pexels-photo-32980837.jpeg"

# Student data
students_data = [
    {"email": "jane.doe@student.moringaschool.com", "name": "Jane Doe"},
    {"email": "john.smith@student.moringaschool.com", "name": "John Smith"},
    {"email": "alice.jones@student.moringaschool.com", "name": "Alice Jones"},
    {"email": "david.brown@student.moringaschool.com", "name": "David Brown"},
    {"email": "chris.white@student.moringaschool.com", "name": "Chris White"},
    {"email": "july.tanaka@student.moringaschool.com", "name": "July Tanaka"},
    {"email": "peter.black@student.moringaschool.com", "name": "Peter Black"},
    {"email": "helen.green@student.moringaschool.com", "name": "Helen Green"},
    {"email": "emma.garcia@student.moringaschool.com", "name": "Emma Garcia"},
    {"email": "lucas.martin@student.moringaschool.com", "name": "Lucas Martin"}
]

# Project templates
projects_data = [
    {
        "title": "AI-Powered Task Management Platform",
        "description": "A comprehensive task management application with AI-powered task prioritization, smart deadline prediction, and team collaboration features. Built using modern web technologies with machine learning integration for productivity optimization.",
        "tech_stack": "React, Node.js, Express, MongoDB, Socket.io, JWT, Material-UI, TensorFlow.js, Python FastAPI",
        "category_name": "Web Development"
    },
    {
        "title": "Smart Fitness Tracker with AR Features", 
        "description": "Cross-platform mobile application for fitness tracking with augmented reality workout guidance, personalized nutrition recommendations, and social challenges. Integrates with wearable devices and provides AI-powered health insights.",
        "tech_stack": "React Native, Firebase, Redux, Expo, ARKit/ARCore, TensorFlow Lite, Chart.js",
        "category_name": "Mobile Apps"
    },
    {
        "title": "Predictive Customer Analytics Dashboard",
        "description": "Machine learning powered dashboard for analyzing customer behavior patterns, predicting purchasing trends, and optimizing marketing campaigns. Includes real-time data visualization, automated reporting, and A/B testing framework.",
        "tech_stack": "Python, Pandas, Scikit-learn, TensorFlow, Plotly, Streamlit, PostgreSQL, Docker",
        "category_name": "Data Science"
    },
    {
        "title": "Kubernetes Microservices Deployment Pipeline",
        "description": "Automated CI/CD pipeline for microservices deployment on Kubernetes with monitoring, logging, and auto-scaling capabilities. Includes infrastructure as code, security scanning, and blue-green deployment strategies.",
        "tech_stack": "Kubernetes, Docker, Jenkins, Terraform, Prometheus, Grafana, Helm, AWS/GCP",
        "category_name": "DevOps"
    },
    {
        "title": "E-commerce Platform with Real-time Chat",
        "description": "Full-featured e-commerce platform with real-time customer support chat, inventory management, payment processing, and analytics dashboard. Includes mobile-responsive design and progressive web app capabilities.",
        "tech_stack": "Vue.js, Django, PostgreSQL, Redis, WebSocket, Stripe API, Docker",
        "category_name": "Web Development"
    },
    {
        "title": "Blockchain-based Voting System",
        "description": "Secure digital voting platform using blockchain technology to ensure transparency, immutability, and voter privacy. Features include identity verification, real-time vote counting, and audit trails.",
        "tech_stack": "Solidity, Web3.js, React, Node.js, IPFS, MetaMask integration",
        "category_name": "Web Development"
    },
    {
        "title": "IoT Home Automation System",
        "description": "Smart home automation system with mobile app control, voice commands, and machine learning-based energy optimization. Integrates with various IoT devices and provides detailed usage analytics.",
        "tech_stack": "Raspberry Pi, Arduino, Flutter, Firebase, Google Assistant, MQTT",
        "category_name": "Mobile Apps"
    },
    {
        "title": "Medical Image Analysis with Deep Learning",
        "description": "AI-powered medical imaging analysis system for early disease detection using convolutional neural networks. Supports X-ray, MRI, and CT scan analysis with high accuracy diagnostic predictions.",
        "tech_stack": "Python, TensorFlow, OpenCV, Flask, Docker, DICOM processing",
        "category_name": "Data Science"
    },
    {
        "title": "Social Media Analytics Platform",
        "description": "Comprehensive social media analytics platform that aggregates data from multiple platforms, provides sentiment analysis, trend prediction, and automated reporting for businesses and influencers.",
        "tech_stack": "Python, Apache Kafka, Elasticsearch, React, D3.js, Natural Language Processing",
        "category_name": "Data Science"
    },
    {
        "title": "Virtual Reality Learning Environment",
        "description": "Immersive VR educational platform for interactive learning experiences across various subjects. Features include 3D simulations, collaborative virtual classrooms, and progress tracking.",
        "tech_stack": "Unity, C#, Oculus SDK, Node.js, MongoDB, WebRTC",
        "category_name": "UI/UX Design"
    }
]

mentors = [
    "Prof. John Smith",
    "Dr. Sarah Wilson", 
    "Dr. Michael Chen",
    "Eng. David Kim",
    "Prof. Lisa Anderson",
    "Dr. Robert Taylor",
    "Eng. Maria Rodriguez",
    "Prof. James Wilson",
    "Dr. Emily Brown",
    "Eng. Thomas Lee"
]

def create_students_and_projects():
    """Create students and their projects directly in the database"""
    app = create_app()
    
    with app.app_context():
        try:
            print("🚀 Starting direct database population...")
            print("=" * 60)
            
            # Get roles
            student_role = Role.query.filter_by(name='student').first()
            if not student_role:
                print("❌ Student role not found!")
                return
                
            print(f"✅ Found student role: {student_role.name}")
            
            # Get categories
            categories = Category.query.all()
            category_map = {cat.name: cat for cat in categories}
            print(f"✅ Found {len(categories)} categories: {', '.join(category_map.keys())}")
            
            created_users = []
            created_projects = []
            
            # Create students and projects
            for i, student_data in enumerate(students_data):
                print(f"\n📝 Processing student {i+1}/10: {student_data['name']}")
                
                # Check if user already exists
                existing_user = User.query.filter_by(email=student_data['email']).first()
                if existing_user:
                    print(f"⚠️  User {student_data['email']} already exists, skipping...")
                    continue
                
                # Create student user
                student = User(
                    email=student_data['email'],
                    password_hash=generate_password_hash('StrongPass123!'),
                    role_id=student_role.id,
                    bio=f"Full-stack developer passionate about web technologies and AI. Specializing in modern development practices.",
                    socials=f"github.com/{student_data['name'].lower().replace(' ', '')}, linkedin.com/in/{student_data['name'].lower().replace(' ', '-')}",
                    past_projects=f"Various innovative projects in web development, mobile apps, and emerging technologies.",
                    phone=f"+25470{random.randint(1000000, 9999999)}"
                )
                
                db.session.add(student)
                db.session.flush()  # Get the user ID
                created_users.append(student)
                print(f"✅ Created user: {student.email} (ID: {student.id})")
                
                # Create project for this student
                project_template = projects_data[i % len(projects_data)]
                
                # Get category
                category = category_map.get(project_template['category_name'])
                if not category:
                    # Default to first category if not found
                    category = categories[0] if categories else None
                    print(f"⚠️  Category '{project_template['category_name']}' not found, using '{category.name}' instead")
                
                if category:
                    project = Project(
                        title=f"{project_template['title']} by {student_data['name']}",
                        description=project_template['description'],
                        tech_stack=project_template['tech_stack'],
                        github_link=f"https://github.com/{student_data['name'].lower().replace(' ', '')}/{project_template['title'].lower().replace(' ', '-')}",
                        demo_link=f"https://{project_template['title'].lower().replace(' ', '-')}-demo.netlify.app",
                        is_for_sale=random.choice([True, False]),
                        technical_mentor=mentors[i % len(mentors)],
                        image_url=IMAGE_URL,
                        category_id=category.id,
                        status='approved',  # Auto-approve for testing
                        featured=random.choice([True, False, False, False]),  # 25% chance of being featured
                        views=random.randint(50, 500),
                        clicks=random.randint(10, 100),
                        downloads=random.randint(5, 50),
                        created_at=datetime.utcnow(),
                        updated_at=datetime.utcnow()
                    )
                    
                    db.session.add(project)
                    db.session.flush()  # Get the project ID
                    created_projects.append(project)
                    print(f"✅ Created project: {project.title} (ID: {project.id})")
                else:
                    print(f"❌ No category found for project")
            
            # Commit all changes
            db.session.commit()
            
            # Summary
            print("\n" + "=" * 60)
            print("📊 SUMMARY")
            print("=" * 60)
            print(f"👥 Students created: {len(created_users)}")
            print(f"📁 Projects created: {len(created_projects)}")
            print(f"🌟 Process completed successfully!")
            
            # Display created users
            if created_users:
                print("\n👥 Created Students:")
                for user in created_users:
                    print(f"   • {user.email} (ID: {user.id})")
            
            # Display created projects  
            if created_projects:
                print("\n📁 Created Projects:")
                for project in created_projects:
                    print(f"   • {project.title} (ID: {project.id}, Status: {project.status})")
                    
        except Exception as e:
            print(f"❌ Error: {e}")
            db.session.rollback()
            raise

if __name__ == "__main__":
    create_students_and_projects()
