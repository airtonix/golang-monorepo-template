package health

import (
	"reflect"
	"testing"
)

func TestHealth(t *testing.T) {
	result := Ping("works")
	if reflect.TypeOf(result).String() != "func(*gin.Context)" {
		t.Error("Expected Health not of type")
	}
}
