package cloudinary

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

var CLD *cloudinary.Cloudinary

func InitCloudinary() error {
	var err error
	CLD, err = cloudinary.NewFromURL(os.Getenv("CLOUDINARY_URL"))
	if err != nil {
		return err
	}
	CLD.Config.URL.Secure = true
	return nil
}

func UploadFile(file multipart.File, filename string, contentType string) (string, error) {
	if CLD == nil {
		return "", fmt.Errorf("Cloudinary not initialized")
	}
	ctx := context.Background()

	fmt.Printf("Uploading file: %s, ContentType: %s\n", filename, contentType)

	isImage := strings.HasPrefix(strings.ToLower(contentType), "image/")

	var resourceType string
	var publicID string

	if isImage {
		resourceType = "image"
		if idx := strings.LastIndex(filename, "."); idx != -1 {
			publicID = filename[:idx]
		} else {
			publicID = filename
		}
	} else {
		resourceType = "raw"
		publicID = filename
	}

	fmt.Printf("Selected ResourceType: %s, PublicID: %s\n", resourceType, publicID)

	resp, err := CLD.Upload.Upload(ctx, file, uploader.UploadParams{
		PublicID:       publicID,
		UniqueFilename: api.Bool(false),
		Overwrite:      api.Bool(true),
		ResourceType:   resourceType,
	})
	if err != nil {
		return "", fmt.Errorf("upload failed: %w", err)
	}

	fmt.Printf("Upload successful. SecureURL: %s\n", resp.SecureURL)

	return resp.SecureURL, nil
}
