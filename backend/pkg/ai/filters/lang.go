package ai

import (
	prompts "github.com/uBuildIt/GoLang/chatGO/pkg/ai/prompts"
	ai_services "github.com/uBuildIt/GoLang/chatGO/pkg/ai/services"
)

func ProcessSafeLangFilter(message string) string{
	// formattedPrompt := utilities.FormatPrompt(prompts.PartialSafeLangPrompt, map[string]interface{}{
	// 	"message": message,
	// })
	return ai_services.ProcessPrompt(prompts.PartialSafeLangPrompt,message)
}
