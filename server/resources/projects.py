from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Project, Category, UserProject
from sqlalchemy import or_
from resources.auth.decorators import role_required, admin_or_role_required, get_current_user
from utils.firebase_storage import upload_file_to_firebase, upload_multiple_files, delete_file_from_firebase, delete_folder_from_firebase, sanitize_folder_name
from datetime import date
import json
import logging

logger = logging.getLogger(__name__)

# Public Projects - Only approved projects (for general public)
class PublicProjects(Resource):
    def get(self):
        """Get approved projects with optional filters for public consumption"""
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            search = request.args.get('search', '')
            category_id = request.args.get('category_id', type=int)
            featured_only = request.args.get('featured', False, type=bool)
            
            query = Project.query.filter(Project.status == 'approved')
            
            # Filter by featured
            if featured_only:
                query = query.filter(Project.featured == True)
            
            # Search filter
            if search:
                query = query.filter(
                    or_(
                        Project.title.ilike(f'%{search}%'),
                        Project.description.ilike(f'%{search}%'),
                        Project.tech_stack.ilike(f'%{search}%')
                    )
                )
            
            # Category filter
            if category_id:
                query = query.filter(Project.category_id == category_id)
            
            # Order by featured first, then newest
            query = query.order_by(Project.featured.desc(), Project.id.desc())
            
            projects = query.paginate(
                page=page, 
                per_page=per_page, 
                error_out=False
            )
            
            return {
                'projects': [project.to_dict() for project in projects.items],
                'total': projects.total,
                'pages': projects.pages,
                'current_page': page,
                'per_page': per_page
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

# Featured Projects - Quick endpoint for homepage
class FeaturedProjects(Resource):
    def get(self):
        """Get featured approved projects for homepage/highlights"""
        try:
            limit = request.args.get('limit', 6, type=int)  # Default 6 for homepage
            
            projects = Project.query.filter(
                Project.status == 'approved',
                Project.featured == True
            ).order_by(Project.id.desc()).limit(limit).all()
            
            return {
                'projects': [project.to_dict() for project in projects],
                'count': len(projects)
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

# All Projects - Admin/management view with all statuses
class AllProjects(Resource):
    @jwt_required()
    @role_required('admin')
    def get(self):
        """Get all projects regardless of status (admin only)"""
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            status_filter = request.args.get('status', '')  # pending, approved, rejected
            search = request.args.get('search', '')
            category_id = request.args.get('category_id', type=int)
            
            query = Project.query
            
            # Status filter
            if status_filter:
                query = query.filter(Project.status == status_filter)
            
            # Search filter
            if search:
                query = query.filter(
                    or_(
                        Project.title.ilike(f'%{search}%'),
                        Project.description.ilike(f'%{search}%'),
                        Project.tech_stack.ilike(f'%{search}%')
                    )
                )
            
            # Category filter
            if category_id:
                query = query.filter(Project.category_id == category_id)
            
            # Order by newest first
            query = query.order_by(Project.id.desc())
            
            projects = query.paginate(
                page=page, 
                per_page=per_page, 
                error_out=False
            )
            
            return {
                'projects': [project.to_dict() for project in projects.items],
                'total': projects.total,
                'pages': projects.pages,
                'current_page': page,
                'per_page': per_page,
                'status_counts': {
                    'pending': Project.query.filter_by(status='pending').count(),
                    'approved': Project.query.filter_by(status='approved').count(),
                    'rejected': Project.query.filter_by(status='rejected').count()
                }
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

# Projects by Category - Simple category-based listing
class ProjectsByCategory(Resource):
    def get(self, category_id):
        """Get approved projects by category ID"""
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            # Verify category exists
            category = Category.query.get_or_404(category_id)
            
            projects = Project.query.filter(
                Project.category_id == category_id,
                Project.status == 'approved'
            ).order_by(Project.featured.desc(), Project.id.desc()).paginate(
                page=page, 
                per_page=per_page, 
                error_out=False
            )
            
            return {
                'category': category.to_dict(),
                'projects': [project.to_dict() for project in projects.items],
                'total': projects.total,
                'pages': projects.pages,
                'current_page': page,
                'per_page': per_page
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

# My Projects - Student's own projects
class MyProjects(Resource):
    @jwt_required()
    @role_required('student')
    def get(self):
        """Get current student's projects"""
        try:
            current_user = get_current_user()
            user_id = current_user.id
            
            # Method 1: Get projects where user is linked via UserProject (current approach)
            # user_projects = UserProject.query.filter_by(user_id=user_id).all()
            # projects = [up.project for up in user_projects]
            
            # Method 2: More efficient - Direct join query
            projects = Project.query.join(UserProject).filter(
                UserProject.user_id == user_id
            ).all()
            
            return {
                'projects': [project.to_dict() for project in projects],
                'count': len(projects),
                'status_counts': {
                    'pending': len([p for p in projects if p.status == 'pending']),
                    'approved': len([p for p in projects if p.status == 'approved']),
                    'rejected': len([p for p in projects if p.status == 'rejected'])
                }
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

# Create Project - Simplified creation
class CreateProject(Resource):
    
    @jwt_required()
    @role_required('student') # Only students can create projects
    def post(self):
        try:
            user_id = int(get_jwt_identity())  # Convert string back to int
            
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['title', 'description', 'category_id']
            for field in required_fields:
                if field not in data or not data[field]:
                    return {'error': f'{field} is required'}, 400
            
            # Check if category exists
            category = Category.query.get(data['category_id'])
            if not category:
                return {'error': 'Category not found'}, 404
            
            # Create new project
            project = Project(
                title=data['title'],
                description=data['description'],
                category_id=data['category_id'],
                tech_stack=data.get('tech_stack', ''),
                github_link=data.get('github_link', ''),
                demo_link=data.get('demo_link', ''),
                is_for_sale=data.get('is_for_sale', False),
                status='pending', # New projects are pending by default
                featured=False,
                technical_mentor=data.get('technical_mentor', '')
            )
            
            db.session.add(project)
            db.session.flush()  # Get the project ID
            
            # Link student to project via UserProject
            user_project = UserProject(
                user_id=user_id,
                project_id=project.id,
                interested_in='contributor', # Default for student creating project
                date=date.today()
            )
            db.session.add(user_project)
            
            db.session.commit()
            
            return {
                'message': 'Project created successfully and submitted for review',
                'project': project.to_dict()
            }, 201
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class ProjectDetail(Resource):
    def get(self, id):
        try:
            project = Project.query.get_or_404(id)
            
            # Increment view count
            project.views += 1
            db.session.commit()
            
            return {'project': project.to_dict()}, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @admin_or_role_required(['student']) # Students can update their own, admins can update any
    def put(self, id):
        try:
            current_user = get_current_user()
            user_id = current_user.id
            role_name = current_user.role.name
            project = Project.query.get_or_404(id)
            
            # Check if user is the project owner or admin
            if role_name == 'student':
                user_project = UserProject.query.filter_by(
                    user_id=user_id,
                    project_id=id
                ).first()
                if not user_project:
                    return {'error': 'You can only update your own projects'}, 403
            elif role_name != 'admin':
                return {'error': 'Unauthorized'}, 403
            
            data = request.get_json()
            
            # Update project fields
            if 'title' in data: project.title = data['title']
            if 'description' in data: project.description = data['description']
            if 'tech_stack' in data: project.tech_stack = data['tech_stack']
            if 'github_link' in data: project.github_link = data['github_link']
            if 'demo_link' in data: project.demo_link = data['demo_link']
            if 'is_for_sale' in data: project.is_for_sale = data['is_for_sale']
            if 'category_id' in data: 
                category = Category.query.get(data['category_id'])
                if not category:
                    return {'error': 'Category not found'}, 404
                project.category_id = data['category_id']
            if 'technical_mentor' in data: project.technical_mentor = data['technical_mentor']
            
            # Admin-only fields
            if role_name == 'admin':
                if 'status' in data: project.status = data['status']
                if 'featured' in data: project.featured = data['featured']
            
            db.session.commit()
            
            return {
                'message': 'Project updated successfully',
                'project': project.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @admin_or_role_required(['student']) # Students can delete their own, admins can delete any
    def delete(self, id):
        try:
            current_user = get_current_user()
            user_id = current_user.id
            role_name = current_user.role.name
            project = Project.query.get_or_404(id)
            
            # Check if user is the project owner or admin
            if role_name == 'student':
                user_project = UserProject.query.filter_by(
                    user_id=user_id,
                    project_id=id
                ).first()
                if not user_project:
                    return {'error': 'You can only delete your own projects'}, 403
            elif role_name != 'admin':
                return {'error': 'Unauthorized'}, 403
            
            # Delete all associated media files from Firebase Storage
            sanitized_name = sanitize_folder_name(project.title)
            folder_path = f"projects/{sanitized_name}-{id}"
            
            try:
                success, message, deleted_count = delete_folder_from_firebase(folder_path)
                if success:
                    logger.info(f"Deleted {deleted_count} media files for project {id}")
                else:
                    logger.warning(f"Failed to delete some media files for project {id}: {message}")
                    # Continue with project deletion even if media deletion partially fails
            except Exception as e:
                logger.error(f"Error deleting media files for project {id}: {str(e)}")
                # Continue with project deletion even if media deletion fails
            
            # Delete the project from database
            db.session.delete(project)
            db.session.commit()
            
            return {
                'message': 'Project and associated media deleted successfully',
                'media_deleted': deleted_count if 'deleted_count' in locals() else 0
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class ProjectCategories(Resource):
    def get(self):
        try:
            categories = Category.query.all()
            return {
                'categories': [category.to_dict() for category in categories]
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

class ProjectClick(Resource):
    def post(self, id):
        try:
            project = Project.query.get_or_404(id)
            project.clicks += 1
            db.session.commit()
            
            return {'message': 'Click recorded'}, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class ProjectDownload(Resource):
    def post(self, id):
        try:
            project = Project.query.get_or_404(id)
            project.downloads += 1
            db.session.commit()
            
            return {'message': 'Download recorded'}, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class ProjectMediaUpload(Resource):
    @jwt_required()
    @admin_or_role_required(['student'])  # Students can upload to their own projects, admins can upload to any
    def post(self, project_id):
        try:
            current_user = get_current_user()
            user_id = current_user.id
            role_name = current_user.role.name
            project = Project.query.get_or_404(project_id)
            
            # Check if user is the project owner or admin
            if role_name == 'student':
                user_project = UserProject.query.filter_by(
                    user_id=user_id,
                    project_id=project_id
                ).first()
                if not user_project:
                    return {'error': 'You can only upload media to your own projects'}, 403
            elif role_name != 'admin':
                return {'error': 'Unauthorized'}, 403
            
            # Get uploaded files
            images = request.files.getlist('images')
            videos = request.files.getlist('videos')
            thumbnail = request.files.get('thumbnail')
            
            uploaded_images = []
            uploaded_videos = []
            uploaded_thumbnail = None
            errors = []
            
            # Create folder path using sanitized project name + ID for uniqueness
            sanitized_name = sanitize_folder_name(project.title)
            folder_path = f"projects/{sanitized_name}-{project_id}"
            
            # Upload images
            if images and images[0].filename:  # Check if files were actually provided
                success_count, results, upload_errors = upload_multiple_files(
                    images, folder_path, "image"
                )
                uploaded_images = results
                errors.extend(upload_errors)
            
            # Upload videos
            if videos and videos[0].filename:  # Check if files were actually provided
                success_count, results, upload_errors = upload_multiple_files(
                    videos, folder_path, "video"
                )
                uploaded_videos = results
                errors.extend(upload_errors)
            
            # Upload thumbnail
            if thumbnail and thumbnail.filename:
                success, result = upload_file_to_firebase(thumbnail, folder_path, "thumbnail")
                if success:
                    uploaded_thumbnail = result
                else:
                    errors.append({'filename': thumbnail.filename, 'error': result})
            
            # Update project with new media URLs
            if uploaded_images:
                existing_images = json.loads(project.image_urls) if project.image_urls else []
                existing_images.extend([img['url'] for img in uploaded_images])
                project.image_urls = json.dumps(existing_images)
            
            if uploaded_videos:
                existing_videos = json.loads(project.video_urls) if project.video_urls else []
                existing_videos.extend([vid['url'] for vid in uploaded_videos])
                project.video_urls = json.dumps(existing_videos)
            
            if uploaded_thumbnail:
                project.thumbnail_url = uploaded_thumbnail['url']
            
            db.session.commit()
            
            return {
                'message': 'Media uploaded successfully',
                'uploaded': {
                    'images': uploaded_images,
                    'videos': uploaded_videos,
                    'thumbnail': uploaded_thumbnail
                },
                'errors': errors
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            logger.error(f"Error uploading project media: {str(exc)}")
            return {'error': str(exc)}, 500

class ProjectMediaDelete(Resource):
    @jwt_required()
    @admin_or_role_required(['student'])
    def delete(self, project_id):
        try:
            current_user = get_current_user()
            user_id = current_user.id
            role_name = current_user.role.name
            project = Project.query.get_or_404(project_id)
            
            # Check if user is the project owner or admin
            if role_name == 'student':
                user_project = UserProject.query.filter_by(
                    user_id=user_id,
                    project_id=project_id
                ).first()
                if not user_project:
                    return {'error': 'You can only delete media from your own projects'}, 403
            elif role_name != 'admin':
                return {'error': 'Unauthorized'}, 403
            
            data = request.get_json()
            media_url = data.get('media_url')
            media_type = data.get('media_type')  # 'image', 'video', or 'thumbnail'
            
            if not media_url or not media_type:
                return {'error': 'media_url and media_type are required'}, 400
            
            # Extract storage path from URL (this is a simple approach, might need adjustment based on your URL structure)
            filename = media_url.split('/')[-1] if '/' in media_url else media_url
            sanitized_name = sanitize_folder_name(project.title)
            storage_path = f"projects/{sanitized_name}-{project_id}/{filename}"
            
            # Delete from Firebase Storage
            success, message = delete_file_from_firebase(storage_path)
            
            if success:
                # Remove from project media URLs
                if media_type == 'image' and project.image_urls:
                    image_urls = json.loads(project.image_urls)
                    if media_url in image_urls:
                        image_urls.remove(media_url)
                        project.image_urls = json.dumps(image_urls)
                        
                elif media_type == 'video' and project.video_urls:
                    video_urls = json.loads(project.video_urls)
                    if media_url in video_urls:
                        video_urls.remove(media_url)
                        project.video_urls = json.dumps(video_urls)
                        
                elif media_type == 'thumbnail' and project.thumbnail_url == media_url:
                    project.thumbnail_url = None
                
                db.session.commit()
                return {'message': 'Media deleted successfully'}, 200
            else:
                return {'error': f'Failed to delete media: {message}'}, 500
            
        except Exception as exc:
            db.session.rollback()
            logger.error(f"Error deleting project media: {str(exc)}")
            return {'error': str(exc)}, 500

def setup_routes(api):
    # Public endpoints (no auth required)
    api.add_resource(PublicProjects, '/api/projects')  # Main public projects endpoint
    api.add_resource(FeaturedProjects, '/api/projects/featured')  # Homepage highlights
    api.add_resource(ProjectsByCategory, '/api/projects/category/<int:category_id>')  # Projects by category
    api.add_resource(ProjectDetail, '/api/projects/<int:id>')  # Individual project details
    api.add_resource(ProjectCategories, '/api/categories')  # Available categories
    
    # Student endpoints (auth required)
    api.add_resource(CreateProject, '/api/projects/create')  # Create new project
    api.add_resource(MyProjects, '/api/projects/my')  # Student's own projects
    
    # Admin endpoints (admin auth required)
    api.add_resource(AllProjects, '/api/admin/projects')  # All projects for admin
    
    # Interaction endpoints
    api.add_resource(ProjectClick, '/api/projects/<int:id>/click')
    api.add_resource(ProjectDownload, '/api/projects/<int:id>/download')
    
    # Media endpoints
    api.add_resource(ProjectMediaUpload, '/api/projects/<int:project_id>/media/upload')
    api.add_resource(ProjectMediaDelete, '/api/projects/<int:project_id>/media/delete')
