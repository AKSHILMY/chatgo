package websocket

type ChatMessage struct {
	Id             string `json:"id"`
	Text           string `json:"text"`
	Timestamp      string `json:"timestamp"`
	Incoming       bool   `json:"incoming"`
	Type           int    `json:"type"`
	SenderID       string `json:"sender_id"`
	SystemMessage  string `json:"system_message"`
	AttachmentURL  string `json:"attachment_url,omitempty"`
	AttachmentType string `json:"attachment_type,omitempty"` // 'image', 'pdf', 'audio'
	AttachmentName string `json:"attachment_name,omitempty"`
}
