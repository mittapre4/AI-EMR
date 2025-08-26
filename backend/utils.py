from fhirclient import client

def get_fhir_client():
    settings = {
        'app_id': 'ai-emr-poc',
        'api_base': 'https://your-emr-fhir-server.com',
        'client_id': 'your_client_id',
        'client_secret': 'your_client_secret'
    }
    return client.FHIRClient(settings=settings)
