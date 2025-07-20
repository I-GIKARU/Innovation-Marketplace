from .registration import UserRegistration
from .login import UserLogin, CurrentUser, UserLogout
from .profile import UserProfile
from .dashboard import StudentDashboard, ClientDashboard, AdminDashboard

def setup_routes(api):
    api.add_resource(UserRegistration, '/api/auth/register')
    api.add_resource(UserLogin, '/api/auth/login')
    api.add_resource(CurrentUser, '/api/auth/me')
    api.add_resource(UserLogout, '/api/auth/logout')
    api.add_resource(UserProfile, '/api/auth/profile')
    
    # Dashboard routes
    api.add_resource(StudentDashboard, '/api/dashboard/student')
    api.add_resource(ClientDashboard, '/api/dashboard/client')
    api.add_resource(AdminDashboard, '/api/dashboard/admin')
