package main

import (
	"github.com/airtonix/golang-monorepo-nx/packages/health"
	"github.com/airtonix/golang-monorepo-nx/packages/ping"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(gin.Recovery())
	r.GET("/", health.Check("App Two"))
	r.GET("/ping", ping.Ping("App One"))
	r.Run() // listen and serve on 0.0.0.0:8080
}
