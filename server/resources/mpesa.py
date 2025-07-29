from flask import request
from flask_restful import Resource
from utils.mpesa import MpesaClient, validate_mpesa_config, format_phone_number
import time


class MpesaSTKPush(Resource):
    """Endpoint to initiate M-Pesa STK Push payment (simplified - just send push)"""
    def post(self):
        try:
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['phone_number', 'amount']
            for field in required_fields:
                if not data.get(field):
                    return {'error': f'{field} is required'}, 400
            
            # Validate M-Pesa configuration
            valid_mpesa, missing_configs = validate_mpesa_config()
            if not valid_mpesa:
                return {'error': f'M-Pesa not configured properly. Missing: {", ".join(missing_configs)}'}, 500
            
            # Initialize M-Pesa client
            mpesa_client = MpesaClient()
            
            # Format phone number
            phone_number = format_phone_number(data['phone_number'])
            if not phone_number:
                return {'error': 'Invalid phone number format'}, 400
            
            # Initiate STK push (simplified - we don't track the result)
            result = mpesa_client.stk_push(
                phone_number=phone_number,
                amount=data['amount'],
                account_reference=data.get('account_reference', f'ORDER-{int(time.time())}'),
                transaction_desc=data.get('transaction_desc', 'Payment for merchandise')
            )
            
            if result['success']:
                return {
                    'success': True,
                    'message': 'STK push sent successfully. Please complete payment on your phone.',
                    'checkout_request_id': result.get('checkout_request_id', 'N/A'),
                    'phone_number': phone_number,
                    'amount': data['amount']
                }, 200
            else:
                return {
                    'success': False,
                    'message': result['message']
                }, 400
                
        except Exception as e:
            return {'error': f'Error processing payment: {str(e)}'}, 500




class TestMpesaConfig(Resource):
    """Endpoint to test M-Pesa configuration"""
    def get(self):
        try:
            valid_mpesa, missing_configs = validate_mpesa_config()
            
            if valid_mpesa:
                # Try to get access token to verify credentials
                mpesa_client = MpesaClient()
                access_token = mpesa_client.get_access_token()
                
                if access_token:
                    return {
                        'success': True,
                        'message': 'M-Pesa configuration is valid and credentials work',
                        'environment': mpesa_client.environment,
                        'base_url': mpesa_client.base_url,
                        'business_short_code': mpesa_client.business_short_code,
                        'callback_url': mpesa_client.callback_url,
                        'has_consumer_key': bool(mpesa_client.consumer_key),
                        'has_consumer_secret': bool(mpesa_client.consumer_secret),
                        'has_passkey': bool(mpesa_client.passkey)
                    }, 200
                else:
                    return {
                        'success': False,
                        'message': 'M-Pesa configuration found but credentials are invalid',
                        'environment': mpesa_client.environment,
                        'base_url': mpesa_client.base_url
                    }, 400
            else:
                return {
                    'success': False,
                    'message': f'Missing M-Pesa configuration: {", ".join(missing_configs)}'
                }, 400
                
        except Exception as e:
            return {'error': f'Error testing M-Pesa config: {str(e)}'}, 500


def setup_routes(api):
    # Simplified M-Pesa endpoints - just STK push and config test
    api.add_resource(MpesaSTKPush, '/api/mpesa/stk-push')
    api.add_resource(TestMpesaConfig, '/api/mpesa/test-config')
