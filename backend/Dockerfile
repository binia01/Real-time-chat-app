# Stage 1: Build the application
FROM node:22-alpine

WORKDIR /app
RUN apk add --no-cache netcat-openbsd
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

RUN npm install -g @nestjs/cli
COPY . .
RUN npx prisma generate
RUN npm run build

COPY docker-entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT [ "docker-entrypoint.sh" ]

EXPOSE 3003
RUN npm install pm2 -g
CMD ["pm2-runtime", "dist/main.js", "-i", "max"]