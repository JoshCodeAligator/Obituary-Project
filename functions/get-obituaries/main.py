# add your get-obituaries function here
import boto3

def lambda_handler(event, context):

    client = boto3.client('dynamodb')
    
    response = client.scan(TableName='Obituary-30144922')
    return response['Items']