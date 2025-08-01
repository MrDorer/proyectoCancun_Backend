# Api/Dockerfile -- Also don't confuse
FROM node:22
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8082
CMD ["npm", "run", "start"]