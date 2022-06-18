FROM node:16.15

# Set workdir to /app
WORKDIR /app

# Copy everything except files in dockerignore
COPY . .

# RUN yarn add @sveltejs/kit@next

RUN ["yarn", "install"]

RUN ["yarn", "build"]

EXPOSE 3000

CMD ["node", "./build/index.js"]
