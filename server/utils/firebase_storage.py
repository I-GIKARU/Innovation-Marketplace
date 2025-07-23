import os
import uuid
from firebase_admin import storage
from werkzeug.utils import secure_filename
from flask import current_app
import logging

logger = logging.getLogger(__name__)

# Allowed file extensions (Firebase is for videos and documents only, images go to Cloudinary)
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'}
ALLOWED_DOCUMENT_EXTENSIONS = {'pdf', 'zip', 'rar', '7z', 'tar', 'gz'}
ALL_ALLOWED_EXTENSIONS = ALLOWED_VIDEO_EXTENSIONS | ALLOWED_DOCUMENT_EXTENSIONS

# Maximum file sizes (in bytes) - Images handled by Cloudinary
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB
MAX_DOCUMENT_SIZE = 50 * 1024 * 1024  # 50MB

def allowed_file(filename, file_type='all'):
    """Check if file has allowed extension (Firebase is for videos and documents only)"""
    if not filename or '.' not in filename:
        return False
    
    extension = filename.rsplit('.', 1)[1].lower()
    
    if file_type == 'video':
        return extension in ALLOWED_VIDEO_EXTENSIONS
    elif file_type == 'document':
        return extension in ALLOWED_DOCUMENT_EXTENSIONS
    else:
        return extension in ALL_ALLOWED_EXTENSIONS

def validate_file_size(file, file_type='all'):
    """Validate file size based on type (Firebase is for videos and documents only)"""
    file.seek(0, 2)  # Move to end of file
    size = file.tell()
    file.seek(0)  # Reset file pointer
    
    if file_type == 'video':
        return size <= MAX_VIDEO_SIZE
    elif file_type == 'document':
        return size <= MAX_DOCUMENT_SIZE
    else:
        return size <= MAX_DOCUMENT_SIZE  # Use document limit as default max

def get_file_type(filename):
    """Determine if file is video or document (Firebase doesn't handle images)"""
    if not filename or '.' not in filename:
        return None
    
    extension = filename.rsplit('.', 1)[1].lower()
    
    if extension in ALLOWED_VIDEO_EXTENSIONS:
        return 'video'
    elif extension in ALLOWED_DOCUMENT_EXTENSIONS:
        return 'document'
    else:
        return None

def upload_file_to_firebase(file, folder_path, filename_prefix=''):
    """
    Upload file to Firebase Storage (videos and documents only, images go to Cloudinary)
    
    Args:
        file: File object from request
        folder_path: Path in Firebase Storage (e.g., 'projects')
        filename_prefix: Optional prefix for filename
    
    Returns:
        tuple: (success: bool, result: str|dict)
        - If success: (True, {'url': download_url, 'path': storage_path})
        - If error: (False, error_message)
    """
    try:
        # Get Firebase Storage bucket
        bucket = storage.bucket()
        
        # Validate file
        if not file or not file.filename:
            return False, "No file provided"
        
        # Check file extension
        if not allowed_file(file.filename):
            return False, f"File type not allowed. Allowed types: {', '.join(ALL_ALLOWED_EXTENSIONS)}"
        
        # Determine file type and validate size
        file_type = get_file_type(file.filename)
        if not validate_file_size(file, file_type):
            if file_type == 'video':
                max_size = MAX_VIDEO_SIZE
            elif file_type == 'document':
                max_size = MAX_DOCUMENT_SIZE
            else:
                max_size = MAX_DOCUMENT_SIZE
            max_size_mb = max_size // (1024 * 1024)
            return False, f"File too large. Maximum size for {file_type}s: {max_size_mb}MB"
        
        # Create unique filename
        original_filename = secure_filename(file.filename)
        file_extension = original_filename.rsplit('.', 1)[1].lower()
        unique_id = str(uuid.uuid4())
        
        if filename_prefix:
            new_filename = f"{filename_prefix}_{unique_id}.{file_extension}"
        else:
            new_filename = f"{unique_id}.{file_extension}"
        
        # Create storage path
        storage_path = f"{folder_path}/{new_filename}"
        
        # Upload file to Firebase Storage
        blob = bucket.blob(storage_path)
        
        # Reset file stream position to beginning
        file.stream.seek(0)
        
        # Set content type based on file extension
        content_type = get_content_type(file_extension)
        blob.upload_from_file(
            file.stream,
            content_type=content_type
        )
        
        # Make the file publicly accessible
        blob.make_public()
        
        # Generate the correct Firebase Storage URL for .firebasestorage.app domains
        bucket_name = bucket.name
        if bucket_name.endswith('.firebasestorage.app'):
            # Use Firebase Storage REST API URL format for .firebasestorage.app domains
            from urllib.parse import quote
            encoded_path = quote(storage_path, safe='')
            download_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_path}?alt=media"
        else:
            # Use regular public URL for .appspot.com domains
            download_url = blob.public_url
        
        logger.info(f"File uploaded successfully: {storage_path}")
        
        return True, {
            'url': download_url,
            'path': storage_path,
            'filename': new_filename,
            'original_filename': original_filename,
            'file_type': file_type,
            'size': file.content_length or 0
        }
        
    except Exception as e:
        logger.error(f"Error uploading file to Firebase: {str(e)}")
        return False, f"Upload failed: {str(e)}"

def delete_file_from_firebase(storage_path):
    """
    Delete file from Firebase Storage
    
    Args:
        storage_path: Path to file in Firebase Storage
    
    Returns:
        tuple: (success: bool, message: str)
    """
    try:
        bucket = storage.bucket()
        blob = bucket.blob(storage_path)
        
        # Check if file exists
        if not blob.exists():
            return False, "File not found"
        
        # Delete the file
        blob.delete()
        
        logger.info(f"File deleted successfully: {storage_path}")
        return True, "File deleted successfully"
        
    except Exception as e:
        logger.error(f"Error deleting file from Firebase: {str(e)}")
        return False, f"Delete failed: {str(e)}"

def delete_folder_from_firebase(folder_path):
    """
    Delete all files in a folder from Firebase Storage
    
    Args:
        folder_path: Path to folder in Firebase Storage (e.g., 'projects/my-project-name')
    
    Returns:
        tuple: (success: bool, message: str, deleted_count: int)
    """
    try:
        bucket = storage.bucket()
        
        # List all files in the folder
        blobs = bucket.list_blobs(prefix=folder_path + '/')
        
        deleted_count = 0
        failed_deletions = []
        
        for blob in blobs:
            try:
                blob.delete()
                deleted_count += 1
                logger.info(f"Deleted file: {blob.name}")
            except Exception as e:
                failed_deletions.append(blob.name)
                logger.error(f"Failed to delete file {blob.name}: {str(e)}")
        
        if failed_deletions:
            return False, f"Failed to delete {len(failed_deletions)} files: {', '.join(failed_deletions)}", deleted_count
        
        if deleted_count > 0:
            logger.info(f"Successfully deleted {deleted_count} files from folder: {folder_path}")
            return True, f"Successfully deleted {deleted_count} files", deleted_count
        else:
            return True, "No files found in folder", 0
        
    except Exception as e:
        logger.error(f"Error deleting folder from Firebase: {str(e)}")
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

def get_content_type(file_extension):
    """Get content type based on file extension (Firebase handles videos and documents only)"""
    content_types = {
        # Videos
        'mp4': 'video/mp4',
        'avi': 'video/x-msvideo',
        'mov': 'video/quicktime',
        'wmv': 'video/x-ms-wmv',
        'flv': 'video/x-flv',
        'webm': 'video/webm',
        'mkv': 'video/x-matroska',
        # Documents
        'pdf': 'application/pdf',
        'zip': 'application/zip',
        'rar': 'application/x-rar-compressed',
        '7z': 'application/x-7z-compressed',
        'tar': 'application/x-tar',
        'gz': 'application/gzip'
    }
    
    return content_types.get(file_extension.lower(), 'application/octet-stream')

def get_file_download_url(storage_path):
    """
    Get a secure download URL for a file in Firebase Storage
    
    Args:
        storage_path: Path to file in Firebase Storage (e.g., 'projects/my-project/document.pdf')
    
    Returns:
        tuple: (success: bool, result: str|dict)
        - If success: (True, {'url': download_url, 'exists': True})
        - If error: (False, error_message)
    """
    try:
        bucket = storage.bucket()
        blob = bucket.blob(storage_path)
        
        # Check if file exists
        if not blob.exists():
            return False, "File not found"
        
        # Generate the correct Firebase Storage URL for .firebasestorage.app domains
        bucket_name = bucket.name
        if bucket_name.endswith('.firebasestorage.app'):
            # Use Firebase Storage REST API URL format for .firebasestorage.app domains
            from urllib.parse import quote
            encoded_path = quote(storage_path, safe='')
            download_url = f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_path}?alt=media"
        else:
            # Use regular public URL for .appspot.com domains
            download_url = blob.public_url
        
        logger.info(f"Generated download URL for: {storage_path}")
        
        return True, {
            'url': download_url,
            'exists': True
        }
        
    except Exception as e:
        logger.error(f"Error generating download URL: {str(e)}")
        return False, f"URL generation failed: {str(e)}"

def upload_multiple_files(files, folder_path, filename_prefix=''):
    """
    Upload multiple files to Firebase Storage (videos and documents only)
    
    Args:
        files: List of file objects
        folder_path: Path in Firebase Storage
        filename_prefix: Optional prefix for filenames
    
    Returns:
        tuple: (success_count: int, results: list, errors: list)
    """
    results = []
    errors = []
    success_count = 0
    
    for file in files:
        success, result = upload_file_to_firebase(file, folder_path, filename_prefix)
        
        if success:
            results.append(result)
            success_count += 1
        else:
            errors.append({
                'filename': file.filename if file else 'unknown',
                'error': result
            })
    
    return success_count, results, errors
