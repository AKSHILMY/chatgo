package schemas

type User struct {
	Username string `json:"userName"`
	Email    string `json:"email"`
	Password string `json:"password"`
	ImageUrl string `json:"imageUrl"`
}

type APIResponse struct {
	Error   bool              `json:"error"`
	Message string            `json:"message"`
	Data    map[string]string `json:"data"`
}

type AuthUser struct {
	Username string `json:"userName"`
	Email    string `json:"email"`
	Password string `json:"password"`
	ImageUrl string `json:"imageUrl"`
}
