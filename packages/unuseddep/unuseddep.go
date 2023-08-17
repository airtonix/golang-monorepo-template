package unuseddep

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func UnusedDep(appName string) func(c *gin.Context) {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"UnusedDep": "Bar: " + appName,
		})
	}
}
