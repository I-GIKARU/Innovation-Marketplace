from flask import jsonify
from flask_restful import Resource
from flask_migrate import upgrade
import os

class RunMigrations(Resource):
    def post(self):
        """
        Run database migrations
        This endpoint should be secured in production
        """
        try:
            # Run migrations
            upgrade()
            return jsonify({
                'success': True,
                'message': 'Database migrations completed successfully'
            })
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e),
                'message': 'Failed to run migrations'
            }), 500
    
    def get(self):
        """
        Check migration status
        """
        try:
            from flask_migrate import current
            from flask import current_app
            
            # This is a simple check - in production you'd want more sophisticated status
            return jsonify({
                'success': True,
                'message': 'Migration endpoint is available',
                'database_url': current_app.config.get('SQLALCHEMY_DATABASE_URI', 'Not configured'),
                'environment': os.getenv('FLASK_ENV', 'development')
            })
        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500

def setup_routes(api):
    api.add_resource(RunMigrations, '/api/migrate')
