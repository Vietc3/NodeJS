FROM node:lts

WORKDIR /ohstore-server

# Copy sources code from host to images
COPY . .

# Install node_modules
RUN npm install

# Instal sailsjs
RUN npm -g install sails

# Install pm2
RUN npm install pm2 -g

# Start app
RUN NODE_ENV=production pm2 start app.js --name "ohstore-server" -i max -- --prod

# Save app
RUN pm2 save

# Startup app list
RUN pm2 startup

COPY pm2.json .
CMD ["pm2-runtime", "./pm2.json"]