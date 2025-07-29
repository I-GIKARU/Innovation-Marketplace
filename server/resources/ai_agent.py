from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import db, User, Project
from utils.firebase_auth import firebase_auth_required, get_firebase_user_from_request
from utils.ai_agent import ai_agent
from datetime import datetime
import json

class CVUploadResource(Resource):
    @jwt_required()
    def post(self):
        """Upload CV for a student"""
        from resources.auth.decorators import get_current_user
        
        # Get current user from JWT token
        user = get_current_user()
        if not user:
            return {'error': 'Authentication required'}, 401
        
        # Only students can upload CVs
        if user.role.name != 'student':
            return {'error': 'Only students can upload CVs'}, 403
        
        file = request.files.get('file')
        if not file:
            return {'error': 'No CV file provided'}, 400
        
        if not file.filename.lower().endswith('.pdf'):
            return {'error': 'Only PDF files are allowed for CVs'}, 400
        
        try:
            # Extract text from PDF
            text = ai_agent.extract_text_from_pdf(file.stream)
            if not text:
                return {'error': 'Failed to extract text from CV'}, 500
            
            # Upload PDF to Firebase
            file_info = ai_agent.upload_pdf_to_firebase(file.stream, file_type="cv")
            
            # Generate AI summary
            summary = ai_agent.generate_cv_summary(text)
            
            # Save metadata to Firebase
            metadata = {
                "file_id": file_info['file_id'],
                "user_id": user.id,
                "user_email": user.email,
                "summary": summary,
                "url": file_info['url'],
                "text": text,
                "filename": file.filename
            }
            
            ai_agent.save_document_metadata(file_info['file_id'], metadata, file_type="cv")
            
            # Update user record
            user.cv_url = file_info['url']
            user.cv_summary = summary
            user.cv_file_id = file_info['file_id']
            user.cv_uploaded_at = datetime.utcnow()
            
            db.session.commit()
            
            return {
                'message': 'CV uploaded successfully',
                'file_id': file_info['file_id'],
                'summary': summary,
                'url': file_info['url']
            }, 201
            
        except Exception as e:
            print(f"CV upload error: {e}")
            return {'error': 'Failed to process CV upload'}, 500

class CVQuestionResource(Resource):
    @jwt_required()
    def post(self, user_id):
        """Ask questions about a user's CV (admin only)"""
        from resources.auth.decorators import get_current_user
        
        # Get current user from JWT token
        current_user = get_current_user()
        if not current_user:
            return {'error': 'Authentication required'}, 401
        
        # Check if user is admin
        if current_user.role.name != 'admin':
            return {'error': 'Admin access required'}, 403
        
        # Get target user
        target_user = User.query.get(user_id)
        if not target_user:
            return {'error': 'User not found'}, 404
        
        if not target_user.cv_file_id:
            return {'error': 'User has not uploaded a CV'}, 404
        
        data = request.get_json()
        question = data.get("question")
        if not question:
            return {"error": "Question is required"}, 400
        
        try:
            # Get CV text
            text = ai_agent.get_document_text(target_user.cv_file_id, file_type="cv")
            if not text:
                return {"error": "CV content not available"}, 500
            
            # Generate answer using AI
            answer = ai_agent.answer_project_question(
                question, 
                {
                    'title': f"CV of {target_user.email}",
                    'description': target_user.cv_summary or "Professional CV/Resume",
                    'tech_stack': "Professional Experience"
                }, 
                text
            )
            
            return {"answer": answer}
            
        except Exception as e:
            print(f"CV question error: {e}")
            return {"error": "Failed to process question"}, 500


class ProjectQuestionResource(Resource):
    def post(self, project_id):
        """Ask questions about a project (public access)"""
        project = Project.query.get(project_id)
        if not project:
            return {'error': 'Project not found'}, 404
        
        data = request.get_json()
        question = data.get("question")
        if not question:
            return {"error": "Question is required"}, 400
        
        try:
            # Get project data
            project_data = {
                'title': project.title,
                'description': project.description,
                'tech_stack': project.tech_stack,
                'github_link': project.github_link,
                'demo_link': project.demo_link,
                'technical_mentor': project.technical_mentor
            }
            
            # Get text from regular project PDFs
            project_pdf_texts = ai_agent.get_project_pdf_texts(project)
            
            # Combine all PDF documentation
            if project_pdf_texts:
                combined_documentation = "\n\n=== DOCUMENT SEPARATOR ===\n\n".join(project_pdf_texts)
                print(f"📚 Found {len(project_pdf_texts)} project PDFs with combined length: {len(combined_documentation)}")
            else:
                combined_documentation = None
                print("📄 No project PDFs found for AI to analyze")
            
            # Generate answer
            answer = ai_agent.answer_project_question(question, project_data, combined_documentation)
            
            return {"answer": answer}
            
        except Exception as e:
            print(f"Project question error: {e}")
            return {"error": "Failed to process question"}, 500

class CVDeleteResource(Resource):
    @jwt_required()
    def delete(self):
        """Delete current user's CV"""
        from resources.auth.decorators import get_current_user
        
        # Get current user from JWT token
        user = get_current_user()
        if not user:
            return {'error': 'Authentication required'}, 401
        
        # Only students can delete CVs
        if user.role.name != 'student':
            return {'error': 'Only students can delete CVs'}, 403
        
        if not user.cv_file_id:
            return {'error': 'No CV found to delete'}, 404
        
        try:
            # Delete from Firebase (both PDF and metadata)
            ai_agent.delete_document(user.cv_file_id, file_type="cv")
            
            # Clear CV fields from user record
            user.cv_url = None
            user.cv_summary = None
            user.cv_file_id = None
            user.cv_uploaded_at = None
            
            db.session.commit()
            
            return {
                'message': 'CV deleted successfully'
            }, 200
            
        except Exception as e:
            print(f"CV delete error: {e}")
            db.session.rollback()
            return {'error': 'Failed to delete CV'}, 500

class AdminCVListResource(Resource):
    @jwt_required()
    def get(self):
        """Get list of all student CVs (admin only)"""
        from resources.auth.decorators import get_current_user
        
        # Get current user from JWT token
        current_user = get_current_user()
        if not current_user:
            return {'error': 'Authentication required'}, 401
        
        # Check if user is admin
        if current_user.role.name != 'admin':
            return {'error': 'Admin access required'}, 403
        
        # Get all students with CVs
        students_with_cvs = User.query.filter(
            User.role.has(name='student'),
            User.cv_file_id.isnot(None)
        ).all()
        
        cv_list = []
        for student in students_with_cvs:
            cv_list.append({
                'user_id': student.id,
                'email': student.email,
                'cv_url': student.cv_url,
                'cv_summary': student.cv_summary,
                'cv_uploaded_at': student.cv_uploaded_at.isoformat() if student.cv_uploaded_at else None,
                'bio': student.bio,
                'socials': student.socials,
                'phone': student.phone
            })
        
        return {
            'total_cvs': len(cv_list),
            'cvs': cv_list
        }

class ProjectSummaryResource(Resource):
    def get(self, project_id):
        """Get AI-generated summary for a project (using regular project PDFs)"""
        project = Project.query.get(project_id)
        if not project:
            return {'error': 'Project not found'}, 404
        
        # Check if we have regular project PDFs
        has_project_pdfs = bool(project.pdf_urls)
        
        # If we don't have a summary but we have PDFs, try to generate one
        summary = project.project_summary
        if not summary and has_project_pdfs:
            try:
                print(f"🔄 No existing summary found, generating from project PDFs for project {project_id}")
                
                # Get project data
                project_data = {
                    'title': project.title,
                    'description': project.description,
                    'tech_stack': project.tech_stack,
                    'technical_mentor': project.technical_mentor
                }
                
                # Get text from regular project PDFs
                project_pdf_texts = ai_agent.get_project_pdf_texts(project)
                if project_pdf_texts:
                    combined_pdf_text = "\n\n=== DOCUMENT SEPARATOR ===\n\n".join(project_pdf_texts)
                    summary = ai_agent.generate_project_summary(project_data, combined_pdf_text)
                    
                    # Save the generated summary back to the project
                    project.project_summary = summary
                    db.session.commit()
                    print(f"✅ Generated and saved new summary for project {project_id}")
                    
            except Exception as e:
                print(f"❌ Error generating summary from PDFs: {e}")
        
        return {
            'project_id': project.id,
            'title': project.title,
            'summary': summary,
            'has_documentation': has_project_pdfs,
            'has_project_pdfs': has_project_pdfs
        }

# Setup routes function
def setup_ai_routes(api):
    api.add_resource(CVUploadResource, '/api/ai/cv/upload')
    api.add_resource(CVDeleteResource, '/api/ai/cv/delete')
    api.add_resource(CVQuestionResource, '/api/ai/cv/<int:user_id>/question')
    api.add_resource(ProjectQuestionResource, '/api/ai/project/<int:project_id>/question')
    api.add_resource(AdminCVListResource, '/api/ai/admin/cvs')
    api.add_resource(ProjectSummaryResource, '/api/ai/project/<int:project_id>/summary')
