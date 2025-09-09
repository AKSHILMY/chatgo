package utilties

import (
	"fmt"
	"strings"
)

func FormatPrompt(prompt string, data map[string]interface{}) string {
	result := prompt
	for key, value := range data {
		placeholder := fmt.Sprintf("{%s}", key)
		result = strings.ReplaceAll(result, placeholder, fmt.Sprintf("%v", value)) //%v handles any type
	}
	return result
}
