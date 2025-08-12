#!/bin/bash
cd /home/ec2-user/CloudTalkr/backend

# Cài PM2 nếu chưa có
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

# Cài dependencies
npm ci --production

# Restart app
pm2 delete all || true
pm2 start server.js --name backend
