# Use Golang base image
FROM golang:1.23.0 AS build

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . ./
RUN go build -o /docker-gs-ping
EXPOSE 8080
CMD ["/docker-gs-ping"]
