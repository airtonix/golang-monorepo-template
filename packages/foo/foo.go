package foo

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Foo(appName string) func(c *gin.Context) {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"Foo": "Bar: " + appName,
		})
	}
}
