#!/bin/bash

# Ensure PHP runtime directory exists for the socket
mkdir -p /var/run/php

# Start PHP-FPM
service php8.2-fpm start

# Start Python FastAPI (Uvicorn)
cd /app/python
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000 &

# Start Nginx in foreground
echo "Backend started on port 10000"
nginx -g "daemon off;"
