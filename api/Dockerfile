FROM node:slim
RUN npm install --global nodemon
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]