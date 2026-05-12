#!/bin/bash

# Ensure PHP runtime directory exists
mkdir -p /run/php

# Find the PHP-FPM binary
FPM_BIN=$(which php-fpm8.2 || which php-fpm)
echo "Found PHP-FPM at: $FPM_BIN"

# Debug: Print the PHP listen configuration
echo "PHP-FPM Listen Config:"
grep "^listen =" /etc/php/8.2/fpm/pool.d/www.conf

# Start PHP-FPM in the background
$FPM_BIN -D

# Start Python FastAPI (Uvicorn)
cd /app/python
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000 &

# Start Nginx in foreground
echo "Backend started on port 10000"
nginx -g "daemon off;"
