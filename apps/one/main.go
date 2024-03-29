package main

import (
	"github.com/airtonix/golang-monorepo-nx/packages/foo"
	"github.com/airtonix/golang-monorepo-nx/packages/health"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(gin.Recovery())
	r.GET("/health", health.Check("App One"))
	r.GET("/foo", foo.Foo("App One"))
	r.Run() // listen and serve on 0.0.0.0:8080
}
