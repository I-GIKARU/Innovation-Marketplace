from .login import CurrentUser, UserLogout, FirebaseLogin
from .profile import UserProfile
from .dashboard import StudentDashboard, AdminDashboard

def setup_routes(api):
    # Firebase authentication routes
    # Supports Google Sign-In (students) and email/password (admin)
    api.add_resource(FirebaseLogin, '/api/auth/login')  # Handles authentication and auto-registration
    api.add_resource(CurrentUser, '/api/auth/me')
    api.add_resource(UserLogout, '/api/auth/logout')
    api.add_resource(UserProfile, '/api/auth/profile')
    
    # Dashboard routes
    api.add_resource(StudentDashboard, '/api/dashboard/student')
    api.add_resource(AdminDashboard, '/api/dashboard/admin')
