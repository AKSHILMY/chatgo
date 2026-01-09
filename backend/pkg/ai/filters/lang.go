package ai

import (
	"log"

	prompts "github.com/uBuildIt/GoLang/chatGO/pkg/ai/prompts"
	ai_services "github.com/uBuildIt/GoLang/chatGO/pkg/ai/services"
)

func ProcessSafeLangFilter(message string) string {
	if message == "" {
		return ""
	}
	log.Printf("Processing safe language filter for message: %s", message)
	return ai_services.ProcessPrompt(prompts.PartialSafeLangPrompt, message)
}
