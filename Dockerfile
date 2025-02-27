# syntax=docker.io/docker/dockerfile:1
FROM node:lts-alpine
WORKDIR /app
ARG PB_VERSION=0.24.4
RUN apk add --no-cache unzip ca-certificates
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/
COPY ./pb_migrations /pb/pb_migrations
COPY run.sh run.sh

COPY . .
RUN npm install
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000
EXPOSE 8090
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ./run.sh
