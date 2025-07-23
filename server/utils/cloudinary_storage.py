import os
import uuid
import cloudinary
import cloudinary.uploader
import cloudinary.api
from werkzeug.utils import secure_filename
from flask import current_app
import logging

logger = logging.getLogger(__name__)

# Allowed file extensions (Cloudinary is for images only, videos/documents go to Firebase)
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Maximum file sizes (in bytes) - Videos/documents handled by Firebase
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB

def init_cloudinary(app):
    """Initialize Cloudinary with Flask app config"""
    cloudinary.config(
        cloud_name=app.config['CLOUDINARY_CLOUD_NAME'],
        api_key=app.config['CLOUDINARY_API_KEY'],
        api_secret=app.config['CLOUDINARY_API_SECRET']
    )
    logger.info(f"Cloudinary initialized with cloud: {app.config['CLOUDINARY_CLOUD_NAME']}")

def allowed_file(filename, file_type='image'):
    """Check if file has allowed extension (Cloudinary is for images only)"""
    if not filename or '.' not in filename:
        return False
    
    extension = filename.rsplit('.', 1)[1].lower()
    return extension in ALLOWED_IMAGE_EXTENSIONS

def validate_file_size(file, file_type='image'):
    """Validate file size (Cloudinary is for images only)"""
    file.seek(0, 2)  # Move to end of file
    size = file.tell()
    file.seek(0)  # Reset file pointer
    
    return size <= MAX_IMAGE_SIZE

def get_file_type(filename):
    """Determine if file is an image (Cloudinary only handles images)"""
    if not filename or '.' not in filename:
        return None
    
    extension = filename.rsplit('.', 1)[1].lower()
    
    if extension in ALLOWED_IMAGE_EXTENSIONS:
        return 'image'
    else:
        return None

def upload_file_to_cloudinary(file, folder_path, filename_prefix=''):
    """
    Upload image file to Cloudinary (images only, videos/documents go to Firebase)
    
    Args:
        file: File object from request
        folder_path: Path in Cloudinary (e.g., 'projects', 'merchandise')  
        filename_prefix: Optional prefix for filename
    
    Returns:
        tuple: (success: bool, result: str|dict)
        - If success: (True, {'url': secure_url, 'public_id': public_id, 'resource_type': resource_type})
        - If error: (False, error_message)
    """
    try:
        # Validate file
        if not file or not file.filename:
            return False, "No file provided"
        
        # Check file extension
        if not allowed_file(file.filename, 'image'):
            return False, f"File type not allowed. Allowed image types: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}"
        
        # Determine file type and validate size
        file_type = get_file_type(file.filename)
        if file_type != 'image':
            return False, "Only image files are allowed on Cloudinary"
            
        if not validate_file_size(file, file_type):
            max_size_mb = MAX_IMAGE_SIZE // (1024 * 1024)
            return False, f"File too large. Maximum size for images: {max_size_mb}MB"
        
        # Create unique filename
        original_filename = secure_filename(file.filename)
        file_extension = original_filename.rsplit('.', 1)[1].lower()
        unique_id = str(uuid.uuid4())
        
        if filename_prefix:
            public_id = f"{filename_prefix}_{unique_id}"
        else:
            public_id = unique_id
        
        # Create full folder path
        base_folder = current_app.config.get('CLOUDINARY_FOLDER', 'Innovation-Marketplace')
        full_folder = f"{base_folder}/{folder_path}"
        
        # Set resource type (always image for Cloudinary)
        resource_type = 'image'
        
        # Upload to Cloudinary (image optimization)
        upload_options = {
            'public_id': public_id,
            'folder': full_folder,
            'resource_type': 'image',
            'overwrite': True,
            'quality': 'auto:good',  # Automatic quality optimization
            'fetch_format': 'auto',  # Automatic format optimization (WebP when supported)
            'transformation': [
                {'quality': 'auto:good'},
                {'fetch_format': 'auto'}
            ]
        }
        
        # Reset file pointer
        file.seek(0)
        
        # Upload file
        result = cloudinary.uploader.upload(file, **upload_options)
        
        logger.info(f"File uploaded successfully to Cloudinary: {result['public_id']}")
        
        return True, {
            'url': result['secure_url'],
            'public_id': result['public_id'],
            'resource_type': result['resource_type'],
            'filename': public_id,
            'original_filename': original_filename,
            'file_type': file_type,
            'width': result.get('width'),
            'height': result.get('height'),
            'bytes': result.get('bytes', 0)
        }
        
    except Exception as e:
        logger.error(f"Error uploading file to Cloudinary: {str(e)}")
        return False, f"Upload failed: {str(e)}"

def delete_file_from_cloudinary(public_id, resource_type='image'):
    """
    Delete image file from Cloudinary (images only)
    
    Args:
        public_id: Cloudinary public ID
        resource_type: Always 'image' (Cloudinary only handles images)
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
        
        if result.get('result') == 'ok':
            logger.info(f"File deleted successfully from Cloudinary: {public_id}")
            return True, "File deleted successfully"
        else:
            return False, f"Failed to delete file: {result.get('result', 'Unknown error')}"
        
    except Exception as e:
        logger.error(f"Error deleting file from Cloudinary: {str(e)}")
        return False, f"Delete failed: {str(e)}"

def delete_folder_from_cloudinary(folder_path):
    """
    Delete all files in a folder from Cloudinary
    
    Args:
        folder_path: Path to folder in Cloudinary (e.g., 'projects/my-project-name')
    
    Returns:
        tuple: (success: bool, message: str, deleted_count: int)
    """
    try:
        base_folder = current_app.config.get('CLOUDINARY_FOLDER', 'Innovation-Marketplace')
        full_folder = f"{base_folder}/{folder_path}"
        
        # Get all resources in the folder
        resources = cloudinary.api.resources(
            type='upload',
            prefix=full_folder,
            max_results=500
        )
        
        deleted_count = 0
        failed_deletions = []
        
        for resource in resources.get('resources', []):
            try:
                result = cloudinary.uploader.destroy(
                    resource['public_id'],
                    resource_type=resource['resource_type']
                )
                if result.get('result') == 'ok':
                    deleted_count += 1
                    logger.info(f"Deleted file: {resource['public_id']}")
                else:
                    failed_deletions.append(resource['public_id'])
            except Exception as e:
                failed_deletions.append(resource['public_id'])
                logger.error(f"Failed to delete file {resource['public_id']}: {str(e)}")
        
        if failed_deletions:
            return False, f"Failed to delete {len(failed_deletions)} files: {', '.join(failed_deletions[:5])}", deleted_count
        
        if deleted_count > 0:
            logger.info(f"Successfully deleted {deleted_count} files from folder: {folder_path}")
            return True, f"Successfully deleted {deleted_count} files", deleted_count
        else:
            return True, "No files found in folder", 0
        
    except Exception as e:
        logger.error(f"Error deleting folder from Cloudinary: {str(e)}")
        return False, f"Folder delete failed: {str(e)}", 0

def sanitize_folder_name(name):
    """
    Sanitize project name for use as folder name
    
    Args:
        name: Project name string
    
    Returns:
        str: Sanitized folder name
    """
    import re
    # Remove special characters and replace spaces with hyphens
    sanitized = re.sub(r'[^a-zA-Z0-9\s\-_]', '', name)
    sanitized = re.sub(r'\s+', '-', sanitized)  # Replace spaces with hyphens
    sanitized = sanitized.lower().strip('-')  # Convert to lowercase and remove leading/trailing hyphens
    
    # Ensure the name isn't empty and isn't too long
    if not sanitized:
        sanitized = 'unnamed-project'
    elif len(sanitized) > 50:
        sanitized = sanitized[:50].rstrip('-')
    
    return sanitized

def upload_multiple_files(files, folder_path, filename_prefix=''):
    """
    Upload multiple image files to Cloudinary (images only)
    
    Args:
        files: List of image file objects
        folder_path: Path in Cloudinary
        filename_prefix: Optional prefix for filenames
    
    Returns:
        tuple: (success_count: int, results: list, errors: list)
    """
    results = []
    errors = []
    success_count = 0
    
    for file in files:
        success, result = upload_file_to_cloudinary(file, folder_path, filename_prefix)
        
        if success:
            results.append(result)
            success_count += 1
        else:
            errors.append({
                'filename': file.filename if file else 'unknown',
                'error': result
            })
    
    return success_count, results, errors
