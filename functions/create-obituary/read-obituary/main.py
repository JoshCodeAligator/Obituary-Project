import boto3

def lambda_handler(event, context):
    
    s3 = boto3.client('s3')
    key = event['s3_key']+"Mp3.mp3"
    
    polly = boto3.client('polly')
    text = event['txt']
  
    response = polly.synthesize_speech(
        Engine='neural',
        LanguageCode='en-GB',
        Text=text,
        TextType='text',
        OutputFormat='mp3',
        VoiceId='Arthur'
    )
    
    audio_stream = response['AudioStream'].read()
    s3.put_object(Bucket="speech-and-images", Key=key, Body=audio_stream)
    return event
    