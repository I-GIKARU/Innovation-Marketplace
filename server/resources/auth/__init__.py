from .registration import FirebaseRegistration
from .login import CurrentUser, UserLogout, FirebaseLogin
from .profile import UserProfile
from .dashboard import StudentDashboard, ClientDashboard, AdminDashboard

def setup_routes(api):
    # Firebase-only authentication routes
    api.add_resource(FirebaseRegistration, '/api/auth/register')
    api.add_resource(FirebaseLogin, '/api/auth/login')
    api.add_resource(CurrentUser, '/api/auth/me')
    api.add_resource(UserLogout, '/api/auth/logout')
    api.add_resource(UserProfile, '/api/auth/profile')
    
    # Dashboard routes
    api.add_resource(StudentDashboard, '/api/dashboard/student')
    api.add_resource(ClientDashboard, '/api/dashboard/client')
    api.add_resource(AdminDashboard, '/api/dashboard/admin')
