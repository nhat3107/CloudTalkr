#!/bin/bash
echo "Loading environment variables from SSM..."
aws ssm get-parameters-by-path \
  --path "CloudTalkr/backend" \
  --with-decryption \
  --query "Parameters[*].[Name,Value]" \
  --output text | while read NAME VALUE
do
  KEY=$(basename "$NAME")
  echo "$KEY=$VALUE"
done > .env
