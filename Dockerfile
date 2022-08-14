# ARG PORT=5000

# FROM keymetrics/pm2:14-alpine AS node

# # Builder stage

# FROM node AS builder

# # Use /app as the CWD
# WORKDIR /app            

# # Copy package.json and package-lock.json to /app
# COPY package*.json ./   

# # Install all dependencies
# RUN npm i               

# # Copy the rest of the code
# COPY . .                

# # Invoke the build script to transpile ts code to js
# RUN npm run build

# # Final stage

# FROM node AS final

# # Set node environment to production
# ENV NODE_ENV production

# # Update the system
# RUN apk --no-cache -U upgrade

# # Prepare destination directory and ensure user node owns it
# RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app

# # Prepare directory for static resources e.g images, email-templates, etc.
# RUN mkdir -p /home/node/app/src/resources

# # Set CWD
# WORKDIR /home/node/app


# COPY package*.json ecosystem.config.js .env*  ./
# COPY src/resources/ ./src/resources

# # Switch to user node
# USER node

# # Install libraries as user node
# RUN npm i --only=production

# # Copy js files and change ownership to user node
# COPY --chown=node:node --from=builder /app/dist ./dist

# # Open desired port
# EXPOSE ${PORT}

# # Use js files to run the application
# CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
