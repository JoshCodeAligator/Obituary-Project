import boto3

def lambda_handler(event, context):

    client = boto3.client('dynamodb')
    
    client.put_item(TableName='Obituary-30144922', Item={
        "name":{'S':event['name']},
        "description":{'S':event['txt']},
        "birth":{'S':event['born']},
        "died":{'S':event['died']}, 
        "s3_key":{'S':event['s3_key']},
        "type":{'S':event['type']}
        })

    
    