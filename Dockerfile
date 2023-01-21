FROM node:latest
WORKDIR app
COPY package*.json ./
RUN npm install && npm install typescript
COPY . /app
EXPOSE 3005

CMD ["npm","run","restart"]