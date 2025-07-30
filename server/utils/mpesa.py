import requests
import base64
from datetime import datetime, timedelta
import json
from flask import current_app
import time


class MpesaClient:
    # Class-level token cache
    _access_token = None
    _token_expires_at = None
    
    def __init__(self):
        self.consumer_key = current_app.config.get('MPESA_CONSUMER_KEY')
        self.consumer_secret = current_app.config.get('MPESA_CONSUMER_SECRET')
        self.business_short_code = current_app.config.get('MPESA_BUSINESS_SHORT_CODE')
        self.passkey = current_app.config.get('MPESA_PASSKEY')
        self.callback_url = current_app.config.get('MPESA_CALLBACK_URL')
        self.environment = current_app.config.get('MPESA_ENVIRONMENT', 'sandbox')
        
        # Set base URLs based on environment
        if self.environment == 'production':
            self.base_url = 'https://api.safaricom.co.ke'
        else:
            self.base_url = 'https://sandbox.safaricom.co.ke'
    
    def get_access_token(self):
        """Get OAuth access token from Safaricom API with caching"""
        try:
            # Check if we have a valid cached token
            now = datetime.now()
            if (MpesaClient._access_token and 
                MpesaClient._token_expires_at and 
                now < MpesaClient._token_expires_at):
                return MpesaClient._access_token
            
            url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
            
            # Create authorization header
            auth_string = f"{self.consumer_key}:{self.consumer_secret}"
            auth_bytes = auth_string.encode('ascii')
            auth_b64 = base64.b64encode(auth_bytes).decode('ascii')
            
            headers = {
                'Authorization': f'Basic {auth_b64}',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            # Add retry logic with delay
            max_retries = 3
            for attempt in range(max_retries):
                response = requests.get(url, headers=headers, timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    access_token = result.get('access_token')
                    expires_in = int(result.get('expires_in', 3600))  # Default 1 hour, ensure it's an integer
                    
                    # Cache the token (expire 5 minutes early to be safe)
                    MpesaClient._access_token = access_token
                    MpesaClient._token_expires_at = now + timedelta(seconds=expires_in - 300)
                    
                    return access_token
                else:
                    print(f"Failed to get access token (attempt {attempt + 1}): {response.status_code} - {response.text}")
                    if attempt < max_retries - 1:
                        time.sleep(2 ** attempt)  # Exponential backoff
            
            return None
                
        except Exception as e:
            print(f"Error getting access token: {str(e)}")
            return None
    
    def generate_password(self):
        """Generate password for STK push"""
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_string = f"{self.business_short_code}{self.passkey}{timestamp}"
        password_bytes = password_string.encode('ascii')
        password_b64 = base64.b64encode(password_bytes).decode('ascii')
        return password_b64, timestamp
    
    def stk_push(self, phone_number, amount, account_reference, transaction_desc):
        """Initiate STK push payment with automatic token refresh on invalid token"""
        # We'll try up to 2 times: once with cached token, once with fresh token if needed
        for attempt in range(2):
            try:
                # Get access token (will use cached token on first attempt)
                access_token = self.get_access_token()
                if not access_token:
                    return {'success': False, 'message': 'Failed to get access token'}
                
                password, timestamp = self.generate_password()
                
                url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
                
                headers = {
                    'Authorization': f'Bearer {access_token}',
                    'Content-Type': 'application/json'
                }
                
                # Format phone number (ensure it starts with 254)
                if phone_number.startswith('0'):
                    phone_number = '254' + phone_number[1:]
                elif phone_number.startswith('+254'):
                    phone_number = phone_number[1:]
                elif not phone_number.startswith('254'):
                    phone_number = '254' + phone_number
                
                payload = {
                    'BusinessShortCode': self.business_short_code,
                    'Password': password,
                    'Timestamp': timestamp,
                    'TransactionType': 'CustomerPayBillOnline',
                    'Amount': int(amount),
                    'PartyA': phone_number,
                    'PartyB': self.business_short_code,
                    'PhoneNumber': phone_number,
                    'CallBackURL': self.callback_url,
                    'AccountReference': account_reference,
                    'TransactionDesc': transaction_desc
                }
                
                response = requests.post(url, json=payload, headers=headers, timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    if result.get('ResponseCode') == '0':
                        return {
                            'success': True,
                            'checkout_request_id': result.get('CheckoutRequestID'),
                            'merchant_request_id': result.get('MerchantRequestID'),
                            'message': 'STK push sent successfully'
                        }
                    else:
                        return {
                            'success': False,
                            'message': result.get('ResponseDescription', 'Unknown error')
                        }
                else:
                    # Check if this is an invalid token error
                    if response.status_code == 404:
                        try:
                            error_data = response.json()
                            if (error_data.get('errorCode') == '404.001.03' or 
                                'Invalid Access Token' in error_data.get('errorMessage', '')):
                                
                                print(f"Invalid access token detected on attempt {attempt + 1}, clearing cache...")
                                # Clear the cached token so next call gets a fresh one
                                MpesaClient._access_token = None
                                MpesaClient._token_expires_at = None
                                
                                # If this is the first attempt, continue to retry with fresh token
                                if attempt == 0:
                                    print("Retrying with fresh access token...")
                                    continue
                        except (ValueError, json.JSONDecodeError):
                            # If we can't parse the JSON, treat as generic error
                            pass
                    
                    return {
                        'success': False,
                        'message': f'HTTP {response.status_code}: {response.text}'
                    }
                    
            except Exception as e:
                print(f"STK push attempt {attempt + 1} failed: {str(e)}")
                if attempt == 0:
                    # Clear token cache in case it's corrupted and retry
                    MpesaClient._access_token = None
                    MpesaClient._token_expires_at = None
                    continue
                else:
                    return {
                        'success': False,
                        'message': f'Error initiating payment: {str(e)}'
                    }
        
        # If we get here, both attempts failed
        return {
            'success': False,
            'message': 'Failed to initiate payment after retrying with fresh token'
        }
    


def format_phone_number(phone):
    """Format phone number to Safaricom format (254XXXXXXXXX)"""
    if not phone:
        return None
    
    # Remove any spaces, dashes, or plus signs
    phone = phone.replace(' ', '').replace('-', '').replace('+', '')
    
    # Handle different formats
    if phone.startswith('0'):
        return '254' + phone[1:]
    elif phone.startswith('254'):
        return phone
    elif len(phone) == 9:  # Assume it's missing the country code
        return '254' + phone
    else:
        return phone


def validate_mpesa_config():
    """Validate that all required M-Pesa configuration is present"""
    required_configs = [
        'MPESA_CONSUMER_KEY',
        'MPESA_CONSUMER_SECRET', 
        'MPESA_BUSINESS_SHORT_CODE',
        'MPESA_PASSKEY'
    ]
    
    missing_configs = []
    for config in required_configs:
        if not current_app.config.get(config):
            missing_configs.append(config)
    
    return len(missing_configs) == 0, missing_configs
