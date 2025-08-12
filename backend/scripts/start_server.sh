#!/bin/bash
cd /home/ec2-user/CloudTalkr/backend
pm2 stop cloudtalkr || true
pm2 start server.js --name cloudtalkr
