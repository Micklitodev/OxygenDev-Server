FROM node:20-alpine

RUN apk update
RUN apk upgrade
RUN apk add --no-cache bash git python3 py3-pip openssh

RUN mkdir -p /app
WORKDIR /app
ADD . /app

RUN chmod +x ./start-server

RUN npm install
RUN npm run build

# start and expose port 4000
EXPOSE 4000
CMD ["bash", "./start-server"]