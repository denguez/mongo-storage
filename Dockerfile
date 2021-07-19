# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:latest
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app/
EXPOSE 9000
CMD ["node", "app.js"]