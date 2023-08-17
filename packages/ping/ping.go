package ping

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Ping(appName string) func(c *gin.Context) {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"Ping": "Ping: " + appName,
		})
	}
}
