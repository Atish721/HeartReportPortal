FROM node:18-slim

# Install Chromium for PDF generation
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]
