#!/bin/bash

# Debug: Print the PHP listen configuration to logs
echo "PHP-FPM Configuration:"
grep "listen =" /etc/php/8.2/fpm/pool.d/www.conf

# Ensure PHP runtime directory exists
mkdir -p /run/php

# Start PHP-FPM in the background
/usr/sbin/php-fpm8.2 -D

# Start Python FastAPI (Uvicorn)
cd /app/python
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000 &

# Start Nginx in foreground
echo "Backend started on port 10000"
nginx -g "daemon off;"
