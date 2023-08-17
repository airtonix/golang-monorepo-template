package health

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Check(appName string) func(c *gin.Context) {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"Hello": "Hello and welcome from " + appName,
		})
	}
}
