package ai

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

func extractFinalText(resp *genai.GenerateContentResponse) string {
	var result string
	for _, cand := range resp.Candidates {
		if cand.Content != nil {
			for _, part := range cand.Content.Parts {
				result += fmt.Sprint(part)
			}
		}
	}
	return result
}

func ProcessPrompt(prompt, message string) string {
	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(os.Getenv("GEMINI_API_KEY")))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-1.5-flash")
	model.SystemInstruction = genai.NewUserContent(genai.Text(prompt))
	resp, err := model.GenerateContent(ctx, genai.Text(message))
	if err != nil {
		log.Fatal(err)
	}
	finalText := extractFinalText(resp)

	res := strings.Split(finalText, "Redacted Message:")
	return strings.TrimSpace(res[1])
}
