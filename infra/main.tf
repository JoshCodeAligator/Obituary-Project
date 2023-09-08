terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "ca-central-1"
}


resource "aws_dynamodb_table" "obituaries" {
  name = "Obituary-30144922"
  billing_mode = "PROVISIONED"
  hash_key = "name"

  read_capacity = 1
  write_capacity = 1

  attribute {
    name = "name"
    type = "S"
  }

  attribute {
    name = "description"
    type = "S"
  }

  attribute {
    name = "birth"
    type = "S"
  }

  attribute {
    name = "died"
    type = "S"
  }

  attribute {
    name = "s3_key"
    type = "S"
  }

   global_secondary_index {
    name               = "birth-index"
    hash_key           = "birth"
    projection_type    = "ALL"
    read_capacity      = 1
    write_capacity     = 1
  }

  global_secondary_index {
    name               = "died-index"
    hash_key           = "died"
    projection_type    = "ALL"
    read_capacity      = 1
    write_capacity     = 1
  }

  global_secondary_index {
    name               = "description-index"
    hash_key           = "description"
    projection_type    = "ALL"
    read_capacity      = 1
    write_capacity     = 1
  }

   global_secondary_index {
    name               = "s3_key-index"
    hash_key           = "s3_key"
    projection_type    = "ALL"
    read_capacity      = 1
    write_capacity     = 1
  }
}

# two lambda functions w/ function url
# one dynamodb table
# roles and policies as needed
# step functions (if you're going for the bonus marks)

resource "aws_iam_role" "state_machine_role" {
  name = "state-machine-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "states.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "state_machine_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.state_machine_role.name
}

resource "aws_iam_policy" "lambda_policy" {
  name        = "lambda_policy"
  policy      = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource = "arn:aws:lambda:ca-central-1:192126134242:function:generate-obituary-30116268"
      },
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource: "arn:aws:lambda:ca-central-1:192126134242:function:read-obituary-30116268"
      },
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource: "arn:aws:lambda:ca-central-1:192126134242:function:save-item-30116268"
      },
      {
        Effect = "Allow"
        Action = [
          "lambda:InvokeFunction"
        ]
        Resource: "arn:aws:lambda:ca-central-1:192126134242:function:store-files-30116268"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  policy_arn = aws_iam_policy.lambda_policy.arn
  role       = aws_iam_role.state_machine_role.name
}

resource "aws_iam_role_policy" "s3_policy" {
  name = "s3-read"
  role = aws_iam_role.state_machine_role.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject"
        ]
        Resource = [
          "arn:aws:s3:::speech-and-images/*"
        ]
      }
    ]
  })
}


resource "aws_sfn_state_machine" "my_state_machine" {
  name = "Obituary-SM-30116268"
  role_arn = aws_iam_role.state_machine_role.arn
  definition = jsonencode({
    StartAt: "Gen",
    States: {
      Gen: {
        Type: "Task",
        Resource: "arn:aws:lambda:ca-central-1:192126134242:function:generate-obituary-30116268",
        Next: "Read",
      },
      Read: {
        Type: "Task",
        Resource: "arn:aws:lambda:ca-central-1:192126134242:function:read-obituary-30116268",
        Next: "Save",
      },
      Save: {
        Type: "Task",
        Resource: "arn:aws:lambda:ca-central-1:192126134242:function:save-item-30116268",
        Next: "Store",
      },
      Store: {
        Type: "Task",
        Resource: "arn:aws:lambda:ca-central-1:192126134242:function:store-files-30116268",
        End: true,
      },
    },
  })
}

