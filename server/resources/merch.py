from flask import request
from flask_restful import Resource
from models import Merchandise

class MerchandiseList(Resource):
    def get(self):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            in_stock = request.args.get('in_stock', True, type=bool)
            
            query = Merchandise.query
            
            if in_stock:
                query = query.filter(Merchandise.is_in_stock == True)
            
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

class MerchandiseDetail(Resource):
    def get(self, id):
        try:
            merchandise = Merchandise.query.get_or_404(id)
            return {'merchandise': merchandise.to_dict()}, 200
            
        except Exception as exc:
            return {'error': str(exc)}, 500

def setup_routes(api):
    api.add_resource(MerchandiseList, '/api/merchandise')
    api.add_resource(MerchandiseDetail, '/api/merchandise/<int:id>')
