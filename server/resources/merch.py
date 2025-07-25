from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from models import db, Merchandise
from resources.auth.decorators import role_required
from utils.cloudinary_storage import upload_file_to_cloudinary, upload_multiple_files, delete_file_from_cloudinary
import json
import logging

logger = logging.getLogger(__name__)

class MerchandiseList(Resource):
    def get(self):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            in_stock_filter = request.args.get('in_stock', '')  # Optional filter
            
            # Start with all merchandise
            query = Merchandise.query
            
            # Filter by stock status if specified
            if in_stock_filter.lower() == 'true':
                query = query.filter(Merchandise.quantity > 0)
            elif in_stock_filter.lower() == 'false':
                query = query.filter(Merchandise.quantity <= 0)
            
            merchandise = query.paginate(
                page=page,
                per_page=per_page,
                error_out=False
            )
            
            return {
                'merchandise': [item.to_dict() for item in merchandise.items],
                'total': merchandise.total,
                'pages': merchandise.pages,
                'current_page': page
            }, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

    @jwt_required()
    @role_required('admin')  # Only admins can create merchandise
    def post(self):
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['name', 'price']
            for field in required_fields:
                if field not in data or data[field] is None:
                    return {'error': f'{field} is required'}, 400
            
            # Create new merchandise
            merchandise = Merchandise(
                name=data['name'],
                description=data.get('description', ''),
                price=data['price'],
                quantity=data.get('quantity', 0),
                image_url=data.get('image_url', '')
            )
            
            db.session.add(merchandise)
            db.session.commit()
            
            return {
                'message': 'Merchandise created successfully',
                'merchandise': merchandise.to_dict()
            }, 201
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class MerchandiseDetail(Resource):
    def get(self, id):
        try:
            merchandise = Merchandise.query.get_or_404(id)
            return {'merchandise': merchandise.to_dict()}, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @role_required('admin')  # Only admins can update merchandise
    def put(self, id):
        try:
            merchandise = Merchandise.query.get_or_404(id)
            data = request.get_json()
            
            # Update merchandise fields
            if 'name' in data:
                merchandise.name = data['name']
            if 'description' in data:
                merchandise.description = data['description']
            if 'price' in data:
                merchandise.price = data['price']
            if 'quantity' in data:
                merchandise.quantity = data['quantity']
            if 'image_url' in data:
                merchandise.image_url = data['image_url']
            
            db.session.commit()
            
            return {
                'message': 'Merchandise updated successfully',
                'merchandise': merchandise.to_dict()
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500
    
    @jwt_required()
    @role_required('admin')  # Only admins can delete merchandise
    def delete(self, id):
        try:
            merchandise = Merchandise.query.get_or_404(id)
            db.session.delete(merchandise)
            db.session.commit()
            
            return {'message': 'Merchandise deleted successfully'}, 200
            
        except Exception as exc:
            db.session.rollback()
            return {'error': str(exc)}, 500

class MerchandiseMediaUpload(Resource):
    @jwt_required()
    @role_required('admin')  # Only admins can upload merchandise media
    def post(self, merchandise_id):
        try:
            merchandise = Merchandise.query.get_or_404(merchandise_id)
            
            # Get uploaded files
            images = request.files.getlist('images')
            thumbnail = request.files.get('thumbnail')
            
            uploaded_images = []
            uploaded_thumbnail = None
            errors = []
            
            folder_path = f"merchandise/{merchandise_id}"
            
            # Upload images
            if images and images[0].filename:  # Check if files were actually provided
                success_count, results, upload_errors = upload_multiple_files(
                    images, folder_path, "merch_image"
                )
                uploaded_images = results
                errors.extend(upload_errors)
            
            # Upload thumbnail
            if thumbnail and thumbnail.filename:
                success, result = upload_file_to_cloudinary(thumbnail, folder_path, "merch_thumbnail")
                if success:
                    uploaded_thumbnail = result
                else:
                    errors.append({'filename': thumbnail.filename, 'error': result})
            
            # Update merchandise with new media URLs
            if uploaded_images:
                existing_images = json.loads(merchandise.image_urls) if merchandise.image_urls else []
                existing_images.extend([img['url'] for img in uploaded_images])
                merchandise.image_urls = json.dumps(existing_images)
                
                # Set first uploaded image as main image_url for backward compatibility
                if not merchandise.image_url:
                    merchandise.image_url = uploaded_images[0]['url']
            
            if uploaded_thumbnail:
                merchandise.thumbnail_url = uploaded_thumbnail['url']
                # Also set as main image if no main image exists
                if not merchandise.image_url:
                    merchandise.image_url = uploaded_thumbnail['url']
            
            db.session.commit()
            
            return {
                'message': 'Media uploaded successfully',
                'uploaded': {
                    'images': uploaded_images,
                    'thumbnail': uploaded_thumbnail
                },
                'errors': errors
            }, 200
            
        except Exception as exc:
            db.session.rollback()
            logger.error(f"Error uploading merchandise media: {str(exc)}")
            return {'error': str(exc)}, 500

class MerchandiseMediaDelete(Resource):
    @jwt_required()
    @role_required('admin')  # Only admins can delete merchandise media
    def delete(self, merchandise_id):
        try:
            merchandise = Merchandise.query.get_or_404(merchandise_id)
            
            data = request.get_json()
            media_url = data.get('media_url')
            media_type = data.get('media_type')  # 'image' or 'thumbnail'
            
            if not media_url or not media_type:
                return {'error': 'media_url and media_type are required'}, 400
            
            # Extract storage path from URL
            storage_path = media_url.split('/')[-1] if '/' in media_url else media_url
            storage_path = f"merchandise/{merchandise_id}/{storage_path}"
            
            # Delete from Cloudinary
            success, message = delete_file_from_cloudinary(storage_path)
            
            if success:
                # Remove from merchandise media URLs
                if media_type == 'image' and merchandise.image_urls:
                    image_urls = json.loads(merchandise.image_urls)
                    if media_url in image_urls:
                        image_urls.remove(media_url)
                        merchandise.image_urls = json.dumps(image_urls)
                        
                        # Update main image_url if it was the deleted image
                        if merchandise.image_url == media_url:
                            merchandise.image_url = image_urls[0] if image_urls else None
                            
                elif media_type == 'thumbnail' and merchandise.thumbnail_url == media_url:
                    merchandise.thumbnail_url = None
                    
                    # Update main image_url if it was the thumbnail
                    if merchandise.image_url == media_url:
                        existing_images = json.loads(merchandise.image_urls) if merchandise.image_urls else []
                        merchandise.image_url = existing_images[0] if existing_images else None
                
                db.session.commit()
                return {'message': 'Media deleted successfully'}, 200
            else:
                return {'error': f'Failed to delete media: {message}'}, 500
            
        except Exception as exc:
            db.session.rollback()
            logger.error(f"Error deleting merchandise media: {str(exc)}")
            return {'error': str(exc)}, 500

class DirectImageUpload(Resource):
    @jwt_required()
    @role_required('admin')  # Only admins can upload images directly
    def post(self):
        """
        Direct image upload endpoint for merchandise
        Stores images in the merchandise folder in Cloudinary
        """
        try:
            # Get the uploaded file
            image = request.files.get('image')
            
            if not image or not image.filename:
                return {'error': 'No image file provided'}, 400
            
            # Get optional filename prefix
            filename_prefix = request.form.get('prefix', 'merch_img')
            
            # Upload to Cloudinary in merchandise folder
            folder_path = "merchandise"
            success, result = upload_file_to_cloudinary(
                image, 
                folder_path, 
                filename_prefix
            )
            
            if success:
                return {
                    'message': 'Image uploaded successfully',
                    'url': result['url'],
                    'image_url': result['url'],  # For backward compatibility
                    'public_id': result['public_id'],
                    'filename': result['filename'],
                    'original_filename': result['original_filename'],
                    'file_type': result['file_type'],
                    'width': result.get('width'),
                    'height': result.get('height'),
                    'bytes': result.get('bytes', 0)
                }, 200
            else:
                return {'error': result}, 400
                
        except Exception as exc:
            logger.error(f"Error in direct image upload: {str(exc)}")
            return {'error': str(exc)}, 500

def setup_routes(api):
    api.add_resource(MerchandiseList, '/api/merchandise')
    api.add_resource(MerchandiseDetail, '/api/merchandise/<int:id>')
    api.add_resource(MerchandiseMediaUpload, '/api/merchandise/<int:merchandise_id>/media/upload')
    api.add_resource(MerchandiseMediaDelete, '/api/merchandise/<int:merchandise_id>/media/delete')
    api.add_resource(DirectImageUpload, '/api/upload')
