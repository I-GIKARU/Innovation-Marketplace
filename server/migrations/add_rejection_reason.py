#!/usr/bin/env python3
"""
Migration to add rejection_reason column to projects table
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from models import db
from sqlalchemy import text

def migrate():
    app = create_app()
    
    with app.app_context():
        try:
            # Check if column already exists
            with db.engine.connect() as connection:
                result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'rejection_reason'"))
                if result.fetchone():
                    print("Column 'rejection_reason' already exists in 'projects' table.")
                    return
                
                # Add the rejection_reason column
                connection.execute(text("ALTER TABLE projects ADD COLUMN rejection_reason TEXT"))
                connection.commit()
            
            print("✅ Successfully added 'rejection_reason' column to 'projects' table")
            
        except Exception as e:
            print(f"❌ Error during migration: {str(e)}")
        
if __name__ == "__main__":
    migrate()
