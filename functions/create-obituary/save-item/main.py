import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder
import boto3

def lambda_handler(event, context):

    ssm = boto3.client('ssm')
    
    r = ssm.get_parameter(
        Name='Cloudinary',
        WithDecryption=True
    )
    key = r['Parameter']['Value']
    
    s3 = boto3.resource('s3', region_name='ca-central-1')
    bucket = s3.Bucket('speech-and-images')
    
    s3_key = event['s3_key']
    obj = bucket.Object(s3_key+"."+event['type'])
    file_obj = obj.get()['Body'].read()

    multipart_data = MultipartEncoder(
        fields={
            "file": (
                s3_key + "Img",
                file_obj,
                event["type"].upper(),
                {"transformation": [
                    {"effect": "art:zorro"}
                ]}
            ),
            "upload_preset": "upload"
        }
    )

    headers = {
        "Content-Type": multipart_data.content_type
    }

    upload_url = f"https://api.cloudinary.com/v1_1/dqn6jivam/image/upload"
    response = requests.post(upload_url, headers=headers, data=multipart_data, auth=("332956665638557", key))
    
    obj = bucket.Object(s3_key+"Mp3.mp3")
    file_obj = obj.get()['Body'].read()
    
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
    
    return event