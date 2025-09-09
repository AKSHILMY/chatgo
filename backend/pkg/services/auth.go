package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/uBuildIt/GoLang/chatGO/pkg/database/cruds"
	"github.com/uBuildIt/GoLang/chatGO/pkg/schemas"
	utilities "github.com/uBuildIt/GoLang/chatGO/pkg/utilities"
)

func CreateUser(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	contentType := r.Header.Get("Content-Type")
	user := schemas.User{}
	if strings.Contains(contentType, "application/json") {
		err = json.Unmarshal(body, &user)
		if err != nil {
			http.Error(w, "Error parsing JSON", http.StatusBadRequest)
			return
		}

	}
	hashedPassword, _ := utilities.HashPassword(user.Password)
	success := cruds.CreateUser(user.Username, user.Email, hashedPassword)
	res := schemas.APIResponse{}
	if !success {
		res.Data = nil
		res.Message = "Unable to Create User!"
	} else {
		res.Message = "Successfully Created User!"
	}
	res.Error = !success
	w.Header().Set("Content-Type", "application/json")
	response, _ := json.Marshal(res)
	w.Write(response)

}

func GetUser(w http.ResponseWriter, r *http.Request) {
	query := r.URL.RawQuery
	request, err := url.ParseQuery(query)
	if err != nil {
		http.Error(w, "Error parsing query", http.StatusBadRequest)
		return
	}
	var input string
	username := request.Get("username")
	email := request.Get("username")
	if username != "" {
		input = username
	} else if email != "" {
		input = email
	}
	user, _ := cruds.GetUserByUsernameOrEmail(input)
	fmt.Println("User Obtained : ", user)
}

func AuthenticateUser(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	contentType := r.Header.Get("Content-Type")
	user := schemas.AuthUser{}
	if strings.Contains(contentType, "application/json") {
		err = json.Unmarshal(body, &user)
		if err != nil {
			http.Error(w, "Error parsing JSON", http.StatusBadRequest)
			return
		}
	}
	var input string
	username := user.Username
	email := user.Email
	if username != "" {
		input = username
	} else if email != "" {
		input = email
	}
	msg, success := cruds.ValidateUser(input, user.Password)
	res := schemas.APIResponse{}
	res.Message = msg
	res.Error = !success

	tokenString, tErr := createToken(schemas.TokenInput{
		Username: user.Username,
	})
	if tErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println("❗️No username found")
		return
	}

	res.Data = map[string]string{
		"token": tokenString,
	}
	w.Header().Set("Content-Type", "application/json")
	response, _ := json.Marshal(res)
	w.Write(response)
}

func createToken(tokenInput schemas.TokenInput) (string, error) {
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		return "", fmt.Errorf("JWT_SECRET_KEY environment variable not set")
	}
	if tokenInput.SecondsToLive == 0 {
		tokenInput.SecondsToLive = 3600 // 1 hour
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"username": tokenInput.Username,
			"exp":      time.Now().Add(time.Second * time.Duration(tokenInput.SecondsToLive)).Unix(),
		})

	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func verifyToken(tokenString string) error {
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		return fmt.Errorf("JWT_SECRET_KEY not set")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secretKey), nil
	})

	if err != nil {
		return err
	}

	if !token.Valid {
		return fmt.Errorf("invalid token")
	}

	return nil
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user schemas.AuthUser
	json.NewDecoder(r.Body).Decode(&user)

	if user.Username == "Chek" && user.Password == "123456" {
		tokenString, err := createToken(schemas.TokenInput{
			Username: user.Username,
		})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println("No username found")
		}
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, tokenString)
		return
	} else {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "Invalid credentials")
	}
}

func ProtectedHandler(w http.ResponseWriter, r *http.Request) schemas.APIResponse {
	res := schemas.APIResponse{}
	w.Header().Set("Content-Type", "application/json")
	tokenString := r.Header.Get("Authorization")
	if tokenString == "" {
		fmt.Println("❗️Missing authorization header")
		http.Error(w, "Missing authorization header", http.StatusUnauthorized)
		res.Error = true
		res.Message = "Missing authorization header"
		return res
	}
	tokenString = tokenString[len("Bearer "):]

	err := verifyToken(tokenString)
	if err != nil {
		fmt.Println("❗️Invalid Token")
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		res.Error = true
		res.Message = "Invalid token"
		return res
	}
	res.Error = false
	res.Message = "Token Validation Successful!"
	return res

}

func AuthLogin(private bool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if private {
			res := ProtectedHandler(w, r)
			if res.Error {
				return
			}
		}
		switch r.Method {
		case "POST":
			AuthenticateUser(w, r)
		default:
			http.Error(w, "Method Not Allowed!", http.StatusMethodNotAllowed)
		}
	}
}

func UserOp(private bool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if private {
			ProtectedHandler(w, r)
		}
		switch r.Method {
		case "GET":
			GetUser(w, r)

		case "POST":
			CreateUser(w, r)
		default:
			http.Error(w, "Method Not Allowed!", http.StatusMethodNotAllowed)
		}
	}
}
