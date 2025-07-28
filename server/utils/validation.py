import re
from config import Config

def validate_student_email(email):

    if not email:
        return False, "Email is required"

    if not email.endswith(Config.STUDENT_EMAIL_DOMAIN):
        return False, f"Student email must end with {Config.STUDENT_EMAIL_DOMAIN}"

    names = email.split('@')[0]

    if names.count('.') != 1:
        return False, "Student email must be in format: firstname.lastname@student.moringaschool.com"

    parts = names.split('.')
    firstname, lastname = parts[0], parts[1]

    name_pattern = re.compile(r'^[a-zA-Z0-9]{2,}$')
    
    if not name_pattern.match(firstname):
        return False, "First name must contain only letters and numbers and be at least 2 characters long"
    
    if not name_pattern.match(lastname):
        return False, "Last name must contain only letters and numbers and be at least 2 characters long"
    
    return True, "Valid student email"

def validate_email_format(email):

    if not email:
        return False, "Email is required"
    
    email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    
    if not email_pattern.match(email):
        return False, "Invalid email format"
    
    return True, "Valid email format"

# Password validation removed - now handled by Firebase
