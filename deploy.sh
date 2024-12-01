set -xe

APP_HOST="ec2-user@52.79.214.21"
APP_PATH="/home/ec2-user/project"
APP_ENTRY="dist/app.js"
APP_NAME="app"   
PEM_PATH="C:/Users/SnowRang/Downloads/sprintWebServer.pem"

npm install
npx tsc

ssh -i $PEM_PATH $APP_HOST "mkdir -p $APP_PATH && echo 'Directory created successfully' || echo 'Failed to create directory'"

#rsync -e "ssh -i $PEM_PATH" --rsync-path="rsync" -avr --exclude=node_modules --exclude=.git ./dist ./package.json ./package-lock.json $APP_HOST:$APP_PATH
scp -i $PEM_PATH -r ./dist ./package.json ./package-lock.json ./prisma/schema.prisma .env.production $APP_HOST:$APP_PATH

ssh -i $PEM_PATH $APP_HOST "cd $APP_PATH && npm install --omit=dev && npx prisma generate && pm2 start $APP_ENTRY --name $APP_NAME || pm2 restart $APP_NAME"