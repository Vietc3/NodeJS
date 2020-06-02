###################### BUILDER ######################
FROM node:lts as builder

WORKDIR /ohstore-builder

# Copy package.json
COPY package.json .

# Install libs
RUN npm install --production --quiet

# Copy source code
COPY . .

# Build source code
RUN npm run build


###################### RUNNER ######################
FROM nginx:stable

# Copy source code
COPY --from=builder /ohstore-builder/build /usr/share/nginx/html

EXPOSE 80
EXPOSE 443