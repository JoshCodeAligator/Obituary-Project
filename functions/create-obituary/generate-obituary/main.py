import requests
import boto3

def lambda_handler(event, context):#url lambda_url = "https://mxecqvtytwxlw642s35yv6lgqu0awnfz.lambda-url.ca-central-1.on.aws/"
    name = event['name']
    birth = event['born']
    death = event['died']
    
    client = boto3.client('ssm')
    
    r = client.get_parameter(
        Name='OpenAI',
        WithDecryption=True
    )
    
    key = r['Parameter']['Value']
    
    headers = {
        'Content-Type': 'json',
        'Authorization': 'Bearer ' + key,
    }

    json_data = {
        'model': 'text-babbage-001',
        'prompt': 'write an obituary about a fictional character named ' + name + ' who was born on ' + birth + ' and died on ' + death + 'that is more than 20 words.',
        'temperature': 0.7,
    }

    response = requests.post('https://api.openai.com/v1/completions', headers=headers, json=json_data)
    
    response_data = response.json()
    event['txt'] = response_data['choices'][0]['text']
    return event