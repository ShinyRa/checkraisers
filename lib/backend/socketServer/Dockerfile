FROM node:16.15

# Set workdir to /app
WORKDIR /app

# Copy everything except files in dockerignore
COPY . .

RUN npm install

# RUN yarn compile || true

# Expose socket.io port
EXPOSE 3001

CMD yarn start
