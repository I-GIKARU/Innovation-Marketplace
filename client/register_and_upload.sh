#!/bin/bash

baseUrl=https://innovation-marketplace-840370620772.us-central1.run.app

# Sample student data
students=(
  "jane.doe@student.moringaschool.com"
  "john.smith@student.moringaschool.com"
  "alice.jones@student.moringaschool.com"
  "david.brown@student.moringaschool.com"
  "chris.white@student.moringaschool.com"
  "july.tanaka@student.moringaschool.com"
  "peter.black@student.moringaschool.com"
  "helen.green@student.moringaschool.com"
  "emma.garcia@student.moringaschool.com"
  "lucas.martin@student.moringaschool.com"
)

# Image URL
image="https://images.pexels.com/photos/32980837/pexels-photo-32980837.jpeg"

# Register students
for email in "${students[@]}"; do
  # Register student
  curl -X POST "$baseUrl/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$email'",
    "password": "StrongPass123!",
    "role": "student",
    "bio": "Full-stack developer passionate about web technologies and AI",
    "socials": "github.com/janedoe, linkedin.com/in/janedoe, twitter.com/janedoe_dev",
    "past_projects": "Various full stack projects",
    "phone": "+254701234567"
  }'

  echo "Registered student: $email"

  # Authenticate and retrieve token
  token=$(curl -X POST "$baseUrl/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$email'",
    "password": "StrongPass123!",
    "role": "student"
  }' | jq -r .access_token)

  echo "Retrieved token for $email: $token"

  # Upload a project for each student
  curl -X POST "$baseUrl/api/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{
    "title": "Platform by '$email'",
    "description": "Innovative project created by '$email'",
    "category_id": 1,
    "tech_stack": "Various Tech",
    "github_link": "https://github.com/janedoe/ai-task-manager",
    "demo_link": "https://demo-link.com",
    "is_for_sale": true,
    "technical_mentor": "Prof. John Smith",
    "image_url": "'$image'"
  }'

  echo "Uploaded project for: $email"
done

# Admin approval POST logic here...


