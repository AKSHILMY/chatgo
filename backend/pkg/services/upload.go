package services

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/uBuildIt/GoLang/chatGO/pkg/services/cloudinary"
)

type UploadResponse struct {
	URL  string `json:"url"`
	Name string `json:"name"`
	Type string `json:"type"`
}

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// 10MB limit
	r.ParseMultipartForm(10 << 20)

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Determine file type based on extension or content type
	fileType := "file"
	contentType := header.Header.Get("Content-Type")
	if strings.HasPrefix(contentType, "image/") {
		fileType = "image"
	} else if strings.HasPrefix(contentType, "audio/") {
		fileType = "audio"
	} else if contentType == "application/pdf" {
		fileType = "pdf"
	}

	url, err := cloudinary.UploadFile(file, header.Filename, contentType)
	if err != nil {
		http.Error(w, "Error uploading to Cloudinary: "+err.Error(), http.StatusInternalServerError)
		return
	}

	resp := UploadResponse{
		URL:  url,
		Name: header.Filename,
		Type: fileType,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
