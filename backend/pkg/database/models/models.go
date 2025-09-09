package database

type User struct {
	Username string
	Email    string `gorm:"unique"`
	Password string
}
