#!/usr/bin/env python3
"""
Firebase Credential Helper for Cloud Deployment

This script converts Firebase service account JSON files to the format needed 
for GOOGLE_CREDENTIALS_JSON environment variable in cloud deployments.

Usage:
    python server/utils/credential_helper.py path/to/service-account.json

Output:
    - Prints the JSON string that should be set as GOOGLE_CREDENTIALS_JSON
    - Validates the JSON format
    - Extracts project_id for FIREBASE_PROJECT_ID
"""

import json
import sys
import os

def validate_service_account_json(json_data):
    """Validate that the JSON contains required service account fields"""
    required_fields = [
        'type',
        'project_id',
        'private_key_id',
        'private_key',
        'client_email',
        'client_id',
        'auth_uri',
        'token_uri'
    ]
    
    missing_fields = []
    for field in required_fields:
        if field not in json_data:
            missing_fields.append(field)
    
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    
    if json_data.get('type') != 'service_account':
        return False, "JSON file is not a service account key"
    
    return True, "Valid service account JSON"

def main():
    if len(sys.argv) != 2:
        print("Usage: python credential_helper.py <path-to-service-account.json>")
        print("\nThis script converts Firebase service account JSON to environment variable format")
        print("for cloud deployments (Cloud Run, Heroku, etc.)")
        sys.exit(1)
    
    json_file_path = sys.argv[1]
    
    # Check if file exists
    if not os.path.exists(json_file_path):
        print(f"❌ Error: File '{json_file_path}' not found")
        sys.exit(1)
    
    try:
        # Read and parse JSON file
        with open(json_file_path, 'r') as f:
            service_account_data = json.load(f)
        
        # Validate the JSON
        is_valid, message = validate_service_account_json(service_account_data)
        if not is_valid:
            print(f"❌ Error: {message}")
            sys.exit(1)
        
        # Convert to compact JSON string (no whitespace)
        credentials_json = json.dumps(service_account_data, separators=(',', ':'))
        
        # Extract project info
        project_id = service_account_data.get('project_id')
        client_email = service_account_data.get('client_email')
        
        print("=" * 60)
        print("🔧 FIREBASE CREDENTIALS FOR CLOUD DEPLOYMENT")
        print("=" * 60)
        print()
        print("✅ Service account JSON is valid")
        print(f"📁 Project ID: {project_id}")
        print(f"📧 Service Email: {client_email}")
        print()
        print("🔑 Environment Variables to Set:")
        print("-" * 40)
        print()
        print("FIREBASE_PROJECT_ID:")
        print(project_id)
        print()
        print("FIREBASE_STORAGE_BUCKET:")
        print(f"{project_id}.firebasestorage.app")
        print()
        print("GOOGLE_CREDENTIALS_JSON:")
        print(credentials_json)
        print()
        print("=" * 60)
        print("📋 DEPLOYMENT INSTRUCTIONS")
        print("=" * 60)
        print()
        print("For Cloud Run:")
        print("1. Go to Google Cloud Console -> Cloud Run")
        print("2. Select your service -> Edit & Deploy New Revision")
        print("3. Go to Variables & Secrets tab")
        print("4. Add the environment variables above")
        print()
        print("For other platforms (Heroku, Railway, etc.):")
        print("1. Set the environment variables in your platform's config")
        print("2. Make sure to escape quotes properly if needed")
        print()
        print("⚠️  SECURITY NOTE:")
        print("Keep these credentials secure and never commit them to version control!")
        print()
        
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON file - {str(e)}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error reading file: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
