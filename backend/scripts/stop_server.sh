#!/bin/bash
echo "Stopping backend server..."
pm2 stop all || true
