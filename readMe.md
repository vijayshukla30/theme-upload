sudo apt install unar -y


APP_PORT=3636
MONGO_HOST=127.0.0.1
MONGO_PORT=27017
MONGO_DB_NAME=theme-upload
S3_BUCKET_URL=https://drapcode-theme.s3.us-east-1.amazonaws.com
THEME_FOLDER=/tmp/theme-upload/
AWS_S3_BUCKET=drapcode-theme
AWS_ACCESS_KEY_ID=*****WAK
AWS_SECRET_ACCESS_KEY=*****KrNxS
AWS_S3_REGION=us-east-1
BUCKET_PERMISSION=public-read
BUILDER_ENGINE=https://builder-api.mydrapcode.com/api/


server {
        location / {
                proxy_pass http://localhost:3636;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
        client_max_body_size 100M;
        server_name theme.mydrapcode.com;
        listen 443 ssl; # managed by Certbot
        ssl_certificate /etc/letsencrypt/live/theme.mydrapcode.com/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/theme.mydrapcode.com/privkey.pem; # managed by Certbot
}
server {
    if ($host = theme.mydrapcode.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
    server_name theme.mydrapcode.com;
    listen 80;
    return 404; # managed by Certbot
}
