from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Project, Category, UserProject
from sqlalchemy import or_
from resources.auth.decorators import role_required, admin_or_role_required, get_current_user
from utils.cloudinary_storage import upload_file_to_cloudinary, upload_multiple_files, delete_file_from_cloudinary, delete_folder_from_cloudinary, sanitize_folder_name
from utils.firebase_storage import upload_file_to_firebase, upload_multiple_files as upload_multiple_files_firebase, delete_file_from_firebase, delete_folder_from_firebase
from datetime import date
import json
import logging

logger = logging.getLogger(__name__)

# Public Projects - All projects (handles both public and admin access)
class PublicProjects(Resource):
    def get(self):
        """Get all projects with optional filters
        
        For public users: Returns projects with basic filtering
        For admin users: Returns all projects with status counts and full access
        """
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            search = request.args.get('search', '')
            category_id = request.args.get('category_id', type=int)
            featured_only = request.args.get('featured', False, type=bool)
            status_filter = request.args.get('status', '')  # Optional status filter
            
            # Check if user is authenticated as admin
            is_admin = False
            try:
                from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
                verify_jwt_in_request(optional=True)
                current_user = get_current_user()
                is_admin = current_user and current_user.role.name == 'admin'
            except Exception:
                # Not authenticated or not admin - continue as public user
                pass
            
            # Start with all projects
            query = Project.query
            
            # Apply status filtering based on user type
            if status_filter:
                if is_admin:
                    # Admin can filter by any status
                    query = query.filter(Project.status == status_filter)
                else:
                    # Public users can only see approved projects when status is specified
                    if status_filter == 'approved':
                        query = query.filter(Project.status == 'approved')
                    # Ignore other status filters for public users
            elif not is_admin:
                # Public users only see approved projects by default
                query = query.filter(Project.status == 'approved')
            # Admin sees all projects by default (no status filter)
            
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
            
            # Order projects
            if is_admin:
                # Admin sees newest first (management view)
                query = query.order_by(Project.id.desc())
            else:
                # Public sees featured first, then newest
                query = query.order_by(Project.featured.desc(), Project.id.desc())
            
            projects = query.paginate(
                page=page, 
                per_page=per_page, 
                error_out=False
            )
            
            response_data = {
                'projects': [project.to_dict() for project in projects.items],
                'total': projects.total,
                'pages': projects.pages,
                'current_page': page,
                'per_page': per_page
            }
            
            # Add status counts for admin users
            if is_admin:
                response_data['status_counts'] = {
                    'pending': Project.query.filter_by(status='pending').count(),
                    'approved': Project.query.filter_by(status='approved').count(),
                    'rejected': Project.query.filter_by(status='rejected').count()
                }
            
            return response_data, 200
            
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

# Approved Projects - Public approved projects only
class ApprovedProjects(Resource):
    def get(self):
        """Get approved projects for public consumption"""
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            search = request.args.get('search', '')
            category_id = request.args.get('category_id', type=int)
            
            # Start with approved projects only
            query = Project.query.filter(Project.status == 'approved')
            
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
            
            # Link student to project via UserProject (project creator)
            user_project = UserProject(
                user_id=user_id,
                project_id=project.id,
                interested_in='contributor', # Default for student creating project
                date=date.today()
            )
            db.session.add(user_project)
            
            # Add additional collaborators if provided
            collaborators = data.get('collaborators', [])
            external_collaborators = []
            
            if collaborators:
                from models import User  # Import here to avoid circular imports
                for collaborator in collaborators:
                    # Handle both old format (string email) and new format (object with name/github)
                    if isinstance(collaborator, str):
                        # Legacy format - skip for now
                        continue
                    elif isinstance(collaborator, dict):
                        collab_name = collaborator.get('name', '').strip()
                        collab_github = collaborator.get('github', '').strip()
                        collab_email = collaborator.get('email', '').strip()
                        
                        if collab_name or collab_github:  # At least name or github is required
                            if collab_email:  # If email provided, check if user exists
                                # Find user by email
                                registered_user = User.query.filter_by(email=collab_email).first()
                                
                                if registered_user and registered_user.id != user_id:  # Registered user, not creator
                                    # Check if already added
                                    existing_collab = UserProject.query.filter_by(
                                        user_id=registered_user.id,
                                        project_id=project.id
                                    ).first()
                                    if not existing_collab:
                                        collab_user_project = UserProject(
                                            user_id=registered_user.id,
                                            project_id=project.id,
                                            interested_in='contributor',
                                            date=date.today()
                                        )
                                        db.session.add(collab_user_project)
                                else:
                                    # Not registered or is creator - add as external collaborator
                                    external_collaborators.append({
                                        'name': collab_name,
                                        'github': collab_github,
                                        'email': collab_email if collab_email != User.query.get(user_id).email else None
                                    })
                            else:
                                # No email provided - definitely external collaborator
                                external_collaborators.append({
                                    'name': collab_name,
                                    'github': collab_github
                                })
            
            # Store external collaborators in JSON format
            if external_collaborators:
                project.external_collaborators = json.dumps(external_collaborators)
            
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
            project = Project.query.get(id)
            if not project:
                return {'error': 'Project not found'}, 404
            
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
            
            # Update project fields available to both students and admins
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
                if 'status' in data:
                    new_status = data['status']
                    project.status = new_status
                    # Handle rejection reason
                    if new_status == 'rejected' and 'rejection_reason' in data:
                        project.rejection_reason = data['rejection_reason']
                    elif new_status != 'rejected':
                        # Clear rejection reason if status is not rejected
                        project.rejection_reason = None
                        
                if 'featured' in data: 
                    project.featured = data['featured']
            
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
            
            # Delete all associated media files from both Cloudinary and Firebase
            sanitized_name = sanitize_folder_name(project.title)
            folder_path = f"projects/{sanitized_name}-{id}"
            
            total_deleted_count = 0
            
            # Delete from Cloudinary (images and thumbnails)
            try:
                success, message, deleted_count = delete_folder_from_cloudinary(folder_path)
                if success:
                    logger.info(f"Deleted {deleted_count} media files from Cloudinary for project {id}")
                    total_deleted_count += deleted_count
                else:
                    logger.warning(f"Failed to delete some media files from Cloudinary for project {id}: {message}")
                    # Continue with deletion
            except Exception as e:
                logger.error(f"Error deleting Cloudinary media files for project {id}: {str(e)}")
                # Continue with deletion
            
            # Delete from Firebase (videos)
            try:
                success, message, deleted_count = delete_folder_from_firebase(folder_path)
                if success:
                    logger.info(f"Deleted {deleted_count} video files from Firebase for project {id}")
                    total_deleted_count += deleted_count
                else:
                    logger.warning(f"Failed to delete some video files from Firebase for project {id}: {message}")
                    # Continue with deletion
            except Exception as e:
                logger.error(f"Error deleting Firebase video files for project {id}: {str(e)}")
                # Continue with deletion
            
            # Delete all related records first to avoid foreign key constraint issues
            # Delete all UserProject records associated with this project
            UserProject.query.filter_by(project_id=id).delete()
            
            # Delete all Review records associated with this project
            from models import Review  # Import here to avoid circular imports
            Review.query.filter_by(project_id=id).delete()
            
            # Now delete the project from database
            db.session.delete(project)
            db.session.commit()
            
            return {
                'message': 'Project and associated media deleted successfully',
                'media_deleted': total_deleted_count
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500




class ProjectCategories(Resource):
    def get(self):
        """Get all project categories"""
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
            videos = request.files.getlist('videos')
            pdfs = request.files.getlist('pdfs')
            zip_files = request.files.getlist('zip_files')
            thumbnail = request.files.get('thumbnail')
            
            uploaded_videos = []
            uploaded_pdfs = []
            uploaded_zip_files = []
            uploaded_thumbnail = None
            errors = []
            
            # Create folder path using sanitized project name + ID for uniqueness
            sanitized_name = sanitize_folder_name(project.title)
            folder_path = f"projects/{sanitized_name}-{project_id}"
            
            # Upload PDFs to Firebase
            if pdfs and pdfs[0].filename:  # Check if files were actually provided
                success_count, results, upload_errors = upload_multiple_files_firebase(
                    pdfs, folder_path, "document"
                )
                uploaded_pdfs = results
                errors.extend(upload_errors)
            
            # Upload ZIP files to Firebase
            if zip_files and zip_files[0].filename:  # Check if files were actually provided
                success_count, results, upload_errors = upload_multiple_files_firebase(
                    zip_files, folder_path, "document"
                )
                uploaded_zip_files = results
                errors.extend(upload_errors)
            
            # Upload videos to Firebase
            if videos and videos[0].filename:  # Check if files were actually provided
                success_count, results, upload_errors = upload_multiple_files_firebase(
                    videos, folder_path, "video"
                )
                uploaded_videos = results
                errors.extend(upload_errors)
            
            # Upload thumbnail
            if thumbnail and thumbnail.filename:
                success, result = upload_file_to_cloudinary(thumbnail, folder_path, "thumbnail")
                if success:
                    uploaded_thumbnail = result
                else:
                    errors.append({'filename': thumbnail.filename, 'error': result})
            
            # Update project with new media URLs
            if uploaded_pdfs:
                existing_pdfs = json.loads(project.pdf_urls) if project.pdf_urls else []
                existing_pdfs.extend([pdf['url'] for pdf in uploaded_pdfs])
                project.pdf_urls = json.dumps(existing_pdfs)
            
            if uploaded_zip_files:
                existing_zips = json.loads(project.zip_urls) if project.zip_urls else []
                existing_zips.extend([zip_file['url'] for zip_file in uploaded_zip_files])
                project.zip_urls = json.dumps(existing_zips)
            
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
                    'pdfs': uploaded_pdfs,
                    'zip_files': uploaded_zip_files,
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
            
            sanitized_name = sanitize_folder_name(project.title)
            
            # Handle deletion based on media type and storage location
            success = False
            message = ""
            
            if media_type == 'video':
                # Videos are stored in Firebase
                # Extract Firebase storage path from URL
                if 'firebasestorage.googleapis.com' in media_url:
                    # Extract path from Firebase URL
                    import urllib.parse
                    parsed_url = urllib.parse.urlparse(media_url)
                    path_parts = parsed_url.path.split('/o/')[1].split('?')[0]  # Get path after /o/ and before ?
                    storage_path = urllib.parse.unquote(path_parts)  # Decode URL encoding
                else:
                    # Fallback - construct path
                    filename = media_url.split('/')[-1] if '/' in media_url else media_url
                    storage_path = f"projects/{sanitized_name}-{project_id}/{filename}"
                
                success, message = delete_file_from_firebase(storage_path)
            else:
                # Images and thumbnails are stored in Cloudinary
                # Extract Cloudinary public ID from URL or construct it
                if 'cloudinary.com' in media_url:
                    # Extract public ID from Cloudinary URL
                    url_parts = media_url.split('/')
                    # Find the part after 'upload' and before file extension
                    try:
                        upload_index = url_parts.index('upload')
                        public_id_parts = url_parts[upload_index + 1:]
                        # Remove any transformation parameters
                        public_id_parts = [part for part in public_id_parts if not part.startswith('v')]
                        public_id = '/'.join(public_id_parts).split('.')[0]  # Remove file extension
                    except (ValueError, IndexError):
                        # Fallback - construct public ID
                        filename = media_url.split('/')[-1].split('.')[0] if '/' in media_url else media_url.split('.')[0]
                        public_id = f"Innovation-Marketplace/projects/{sanitized_name}-{project_id}/{filename}"
                else:
                    # Fallback - construct public ID
                    filename = media_url.split('/')[-1].split('.')[0] if '/' in media_url else media_url.split('.')[0]
                    public_id = f"Innovation-Marketplace/projects/{sanitized_name}-{project_id}/{filename}"
                
                resource_type = 'image'  # Both images and thumbnails are 'image' type in Cloudinary
                success, message = delete_file_from_cloudinary(public_id, resource_type)
            
            if success:
                # Remove from project media URLs
                if media_type == 'video' and project.video_urls:
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
    # Main endpoints (unified for public and admin)
    api.add_resource(PublicProjects, '/api/projects')  # All projects with optional filters (public and admin)
    api.add_resource(ProjectDetail, '/api/projects/<int:id>')  # Individual project details
    api.add_resource(ProjectCategories, '/api/categories')  # Available categories
    
    # Specific project endpoints for common use cases
    api.add_resource(FeaturedProjects, '/api/projects/featured')  # Featured projects (for homepage)
    api.add_resource(ApprovedProjects, '/api/projects/approved')  # Approved projects only (for public listings)
    api.add_resource(ProjectsByCategory, '/api/projects/category/<int:category_id>')  # Projects by category
    
    # Student endpoints (auth required)
    api.add_resource(CreateProject, '/api/projects/create')  # Create new project
    api.add_resource(MyProjects, '/api/projects/my')  # Student's own projects
    
    # Interaction endpoints
    api.add_resource(ProjectClick, '/api/projects/<int:id>/click')
    api.add_resource(ProjectDownload, '/api/projects/<int:id>/download')
    
    # Media endpoints
    api.add_resource(ProjectMediaUpload, '/api/projects/<int:project_id>/media/upload')
    api.add_resource(ProjectMediaDelete, '/api/projects/<int:project_id>/media/delete')
