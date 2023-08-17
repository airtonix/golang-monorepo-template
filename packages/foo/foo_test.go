package health

import (
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestHealthIsFactory(t *testing.T) {
	handler := Foo("works")

	if reflect.TypeOf(handler).String() != "func(*gin.Context)" {
		t.Error("Expected Health not of type")
	}
}

func TestHealthRoute(t *testing.T) {
	handler := Foo("works")

	r := gin.Default()
	r.GET("/test", handler)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/test", nil)
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(
		t,
		"{\"Hello\":\"Hello and welcome from works\"}",
		w.Body.String(),
	)
}
