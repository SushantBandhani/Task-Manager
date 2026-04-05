# Use Node.js 20 Alpine
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for Prisma generate)
RUN npm install

# Copy all source code including prisma folder
COPY . .

# Expose backend port
EXPOSE 8000

RUN npm run prisma:generate
RUN npm run build

# Default command just runs node (no build needed at runtime)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]