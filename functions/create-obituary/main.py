import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder
import boto3
import json

def lambda_handler(event, context):
    items = json.loads(event['body'])
    name = items['name']
    birth = items['born']
    death = items['died']
    
    ssm = boto3.client('ssm')
    
    r = ssm.get_parameter(
        Name='OpenAI',
        WithDecryption=True
    )
    
    key = r['Parameter']['Value']
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key,
    }

    json_data = {
        'model': 'text-davinci-002',
        'prompt': 'write an obituary about a fictional character named ' + name + ' who was born on ' + birth + ' and died on ' + death + ' that contains more than 20 words.',
        'temperature': 0.9,
        'max_tokens': 500
    }

    response = requests.post('https://api.openai.com/v1/completions', headers=headers, json=json_data)
    
    response_data = response.json()
    items['txt'] = response_data['choices'][0]['text']
    
    polly = boto3.client('polly')
    text = items['txt']
  
    response = polly.synthesize_speech(
        Engine='neural',
        LanguageCode='en-GB',
        Text=text,
        TextType='text',
        OutputFormat='mp3',
        VoiceId='Arthur'
    )
    
    audio_stream = response['AudioStream'].read()    
    
    r = ssm.get_parameter(
        Name='Cloudinary',
        WithDecryption=True
    )
    key = r['Parameter']['Value']
    
    s3_key = items['s3_key']
    file_obj = audio_stream
    
    multipart_data = MultipartEncoder(
        fields={
            "file": (s3_key+"Mp3", file_obj, "mp4"),
            "upload_preset": "upload",
            "resource_type": "video"
        }
    )

    headers = {
        "Content-Type": multipart_data.content_type
    }
    
    upload_url = f"https://api.cloudinary.com/v1_1/dqn6jivam/video/upload"
    response = requests.post(upload_url, headers=headers, data=multipart_data, auth=("332956665638557", key))
    
    db = boto3.client('dynamodb')
    
    db.put_item(TableName='Obituary-30144922', Item={
        "name":{'S':items['name']},
        "description":{'S':items['txt']},
        "birth":{'S':items['born']},
        "died":{'S':items['died']}, 
        "s3_key":{'S':items['s3_key']}
        })
        
    return event