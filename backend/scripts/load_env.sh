#!/bin/bash
APP_DIR="/home/ec2-user/CloudTalkr/backend"
ENV_FILE="$APP_DIR/.env"

echo "Loading environment variables from SSM..."
PARAMS=(PORT DATABASE_URL STREAM_API_KEY STREAM_API_SECRET JWT_SECRET_KEY NODE_ENV CLOUDINARY_CLOUD_NAME CLOUDINARY_API_KEY CLOUDINARY_API_SECRET)

> $ENV_FILE
for param in "${PARAMS[@]}"; do
    value=$(aws ssm get-parameter --name "$param" --with-decryption --query "Parameter.Value" --output text)
    echo "$param=$value" >> $ENV_FILE
done

echo "Environment variables loaded into $ENV_FILE"
