#!/usr/bin/env python3
import requests
import json
import time
from faker import Faker

# Configuration
BASE_URL = "https://innovation-marketplace-840370620772.us-central1.run.app"
IMAGE_URL = "https://images.pexels.com/photos/32980837/pexels-photo-32980837.jpeg"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "StrongPass123!"

fake = Faker()

# Student data
students = [
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
project_templates = [
    {
        "title": "AI-Powered Task Management Platform",
        "description": "A comprehensive task management application with AI-powered task prioritization, smart deadline prediction, and team collaboration features. Built using modern web technologies with machine learning integration for productivity optimization.",
        "tech_stack": "React, Node.js, Express, MongoDB, Socket.io, JWT, Material-UI, TensorFlow.js, Python FastAPI",
        "category_id": 1
    },
    {
        "title": "Smart Fitness Tracker with AR Features", 
        "description": "Cross-platform mobile application for fitness tracking with augmented reality workout guidance, personalized nutrition recommendations, and social challenges. Integrates with wearable devices and provides AI-powered health insights.",
        "tech_stack": "React Native, Firebase, Redux, Expo, ARKit/ARCore, TensorFlow Lite, Chart.js",
        "category_id": 2
    },
    {
        "title": "Predictive Customer Analytics Dashboard",
        "description": "Machine learning powered dashboard for analyzing customer behavior patterns, predicting purchasing trends, and optimizing marketing campaigns. Includes real-time data visualization, automated reporting, and A/B testing framework.",
        "tech_stack": "Python, Pandas, Scikit-learn, TensorFlow, Plotly, Streamlit, PostgreSQL, Docker",
        "category_id": 3
    },
    {
        "title": "Kubernetes Microservices Deployment Pipeline",
        "description": "Automated CI/CD pipeline for microservices deployment on Kubernetes with monitoring, logging, and auto-scaling capabilities. Includes infrastructure as code, security scanning, and blue-green deployment strategies.",
        "tech_stack": "Kubernetes, Docker, Jenkins, Terraform, Prometheus, Grafana, Helm, AWS/GCP",
        "category_id": 4
    },
    {
        "title": "E-commerce Platform with Real-time Chat",
        "description": "Full-featured e-commerce platform with real-time customer support chat, inventory management, payment processing, and analytics dashboard. Includes mobile-responsive design and progressive web app capabilities.",
        "tech_stack": "Vue.js, Django, PostgreSQL, Redis, WebSocket, Stripe API, Docker",
        "category_id": 1
    },
    {
        "title": "Blockchain-based Voting System",
        "description": "Secure digital voting platform using blockchain technology to ensure transparency, immutability, and voter privacy. Features include identity verification, real-time vote counting, and audit trails.",
        "tech_stack": "Solidity, Web3.js, React, Node.js, IPFS, MetaMask integration",
        "category_id": 1
    },
    {
        "title": "IoT Home Automation System",
        "description": "Smart home automation system with mobile app control, voice commands, and machine learning-based energy optimization. Integrates with various IoT devices and provides detailed usage analytics.",
        "tech_stack": "Raspberry Pi, Arduino, Flutter, Firebase, Google Assistant, MQTT",
        "category_id": 2
    },
    {
        "title": "Medical Image Analysis with Deep Learning",
        "description": "AI-powered medical imaging analysis system for early disease detection using convolutional neural networks. Supports X-ray, MRI, and CT scan analysis with high accuracy diagnostic predictions.",
        "tech_stack": "Python, TensorFlow, OpenCV, Flask, Docker, DICOM processing",
        "category_id": 3
    },
    {
        "title": "Social Media Analytics Platform",
        "description": "Comprehensive social media analytics platform that aggregates data from multiple platforms, provides sentiment analysis, trend prediction, and automated reporting for businesses and influencers.",
        "tech_stack": "Python, Apache Kafka, Elasticsearch, React, D3.js, Natural Language Processing",
        "category_id": 3
    },
    {
        "title": "Virtual Reality Learning Environment",
        "description": "Immersive VR educational platform for interactive learning experiences across various subjects. Features include 3D simulations, collaborative virtual classrooms, and progress tracking.",
        "tech_stack": "Unity, C#, Oculus SDK, Node.js, MongoDB, WebRTC",
        "category_id": 5
    }
]

def register_student(student):
    """Register a student"""
    url = f"{BASE_URL}/api/auth/register"
    data = {
        "email": student["email"],
        "password": "StrongPass123!",
        "role": "student",
        "bio": f"Full-stack developer passionate about web technologies and AI. {fake.text(max_nb_chars=100)}",
        "socials": f"github.com/{student['name'].lower().replace(' ', '')}, linkedin.com/in/{student['name'].lower().replace(' ', '-')}",
        "past_projects": fake.text(max_nb_chars=150),
        "phone": f"+25470{fake.random_int(1000000, 9999999)}"
    }
    
    try:
        response = requests.post(url, json=data, timeout=30)
        if response.status_code == 201:
            print(f"✅ Registered: {student['email']}")
            return True
        else:
            print(f"❌ Failed to register {student['email']}: {response.status_code} - {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error registering {student['email']}: {e}")
        return False

def login_student(email):
    """Login student and get JWT token"""
    url = f"{BASE_URL}/api/auth/login"
    data = {
        "email": email,
        "password": "StrongPass123!",
        "role": "student"
    }
    
    try:
        response = requests.post(url, json=data, timeout=30)
        if response.status_code == 200:
            print(f"✅ Logged in: {email}")
            return response.cookies  # JWT is in cookies
        else:
            print(f"❌ Failed to login {email}: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error logging in {email}: {e}")
        return None

def upload_project(student, project_template, cookies):
    """Upload a project for the student"""
    url = f"{BASE_URL}/api/projects"
    
    # Customize project for this student
    project_data = {
        "title": f"{project_template['title']} by {student['name']}",
        "description": project_template['description'],
        "category_id": project_template['category_id'],
        "tech_stack": project_template['tech_stack'],
        "github_link": f"https://github.com/{student['name'].lower().replace(' ', '')}/{project_template['title'].lower().replace(' ', '-')}",
        "demo_link": f"https://{project_template['title'].lower().replace(' ', '-')}-demo.netlify.app",
        "is_for_sale": fake.boolean(),
        "technical_mentor": fake.name(),
        "image_url": IMAGE_URL
    }
    
    try:
        response = requests.post(url, json=project_data, cookies=cookies, timeout=30)
        if response.status_code == 201:
            project_id = response.json().get('project', {}).get('id')
            print(f"✅ Uploaded project for {student['name']}: {project_template['title']} (ID: {project_id})")
            return project_id
        else:
            print(f"❌ Failed to upload project for {student['name']}: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error uploading project for {student['name']}: {e}")
        return None

def login_admin():
    """Login as admin"""
    url = f"{BASE_URL}/api/auth/login"
    data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
        "role": "admin"
    }
    
    try:
        response = requests.post(url, json=data, timeout=30)
        if response.status_code == 200:
            print("✅ Admin logged in successfully")
            return response.cookies
        else:
            print(f"❌ Failed to login as admin: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error logging in as admin: {e}")
        return None

def approve_project(project_id, admin_cookies):
    """Approve a project as admin"""
    url = f"{BASE_URL}/api/projects/{project_id}"
    data = {
        "status": "approved",
        "featured": fake.boolean(chance_of_getting_true=30)  # 30% chance of being featured
    }
    
    try:
        response = requests.put(url, json=data, cookies=admin_cookies, timeout=30)
        if response.status_code == 200:
            print(f"✅ Approved project ID: {project_id}")
            return True
        else:
            print(f"❌ Failed to approve project {project_id}: {response.status_code} - {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error approving project {project_id}: {e}")
        return False

def main():
    print("🚀 Starting Innovation Marketplace population script...")
    print("=" * 60)
    
    project_ids = []
    
    # Step 1: Register students and upload projects
    print("\n📝 STEP 1: Registering students and uploading projects")
    print("-" * 50)
    
    for i, student in enumerate(students):
        print(f"\nProcessing student {i+1}/10: {student['name']}")
        
        # Register student
        if not register_student(student):
            continue
        
        time.sleep(1)  # Small delay between requests
        
        # Login student
        cookies = login_student(student['email'])
        if not cookies:
            continue
        
        time.sleep(1)
        
        # Upload project (use different project template for each student)
        project_template = project_templates[i % len(project_templates)]
        project_id = upload_project(student, project_template, cookies)
        if project_id:
            project_ids.append(project_id)
        
        time.sleep(2)  # Delay between students
    
    # Step 2: Admin approval
    print(f"\n👑 STEP 2: Admin approving {len(project_ids)} projects")
    print("-" * 50)
    
    admin_cookies = login_admin()
    if not admin_cookies:
        print("❌ Cannot proceed with admin approval")
        return
    
    time.sleep(1)
    
    approved_count = 0
    for project_id in project_ids:
        if approve_project(project_id, admin_cookies):
            approved_count += 1
        time.sleep(1)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    print(f"👥 Students registered: {len(students)}")
    print(f"📁 Projects uploaded: {len(project_ids)}")
    print(f"✅ Projects approved: {approved_count}")
    print(f"🌟 Process completed successfully!")
    
    if len(project_ids) > 0:
        print(f"\n🔗 You can now view the projects at:")
        print(f"   {BASE_URL.replace('https://', 'https://').replace('.run.app', '.run.app')}/api/projects")

if __name__ == "__main__":
    main()
