FROM python:3.11-slim-bookworm

# Install Nginx and PHP
RUN apt-get update && apt-get install -y \
    nginx \
    php8.2-fpm \
    php8.2-pgsql \
    php8.2-curl \
    php8.2-xml \
    php8.2-mbstring \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Force PHP-FPM to listen on port 9000 (Aggressive match)
RUN sed -i 's/^listen =.*/listen = 127.0.0.1:9000/' /etc/php/8.2/fpm/pool.d/www.conf

# Set up Python Environment
WORKDIR /app/python
COPY Python/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy Python Code
COPY Python/ .

# Set up PHP Environment
WORKDIR /var/www/php
COPY PHP/ .
RUN chmod -R 755 /var/www/php

# Copy Nginx Config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy and setup start script
WORKDIR /app
COPY start.sh .
RUN chmod +x start.sh

# Expose the port Render expects
EXPOSE 10000

# Start the services
CMD ["./start.sh"]
