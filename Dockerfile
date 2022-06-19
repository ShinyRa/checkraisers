FROM node:16.15

# Set workdir to /app
WORKDIR /app

# Copy everything except files in dockerignore
COPY . .

# Install all dependencies
RUN yarn add @sveltejs/kit@next

RUN ["yarn", "install"]

# Build node project
RUN ["yarn", "build"]

# Expose port 3000
EXPOSE 3000
# Expose port 3001
EXPOSE 3001

# Run sveltekit project
CMD ["node", "./build/index.js"]
