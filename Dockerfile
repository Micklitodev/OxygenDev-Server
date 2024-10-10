FROM node:20-alpine

# Setup git and openssh
RUN apk update
RUN apk upgrade
RUN apk add --no-cache bash git python3 py3-pip openssh

# AWS CLI setup 
RUN python3 -m venv /opt/venv
RUN /opt/venv/bin/pip install --no-cache-dir awscli
ENV PATH="/opt/venv/bin:$PATH"
RUN aws --version

# make app directory
RUN mkdir -p /app
WORKDIR /app
ADD . /app

# CHMOD start-server into an executable
RUN chmod +x ./start-server

RUN npm install
RUN npm run build

# Start server
EXPOSE 4000
CMD ["bash", "./start-server"]