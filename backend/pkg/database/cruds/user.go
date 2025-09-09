package cruds

import (
	"fmt"

	database "github.com/uBuildIt/GoLang/chatGO/pkg/database"
	models "github.com/uBuildIt/GoLang/chatGO/pkg/database/models"
	utilties "github.com/uBuildIt/GoLang/chatGO/pkg/utilities"
)

func CreateUser(username, email, password string) bool {
	user := models.User{Username: username, Email: email, Password: password}
	result := database.DB.Create(&user)
	if result.Error != nil {
		fmt.Println("❗️Error creating user:", result.Error)
		return false
	}
	return true
}

func GetUserByUsernameOrEmail(userNameOrEmail string) (models.User, bool) {
	var user models.User
	result := database.DB.Where("username = ?", userNameOrEmail).Or("email = ?", userNameOrEmail).First(&user)
	var success bool = true
	if result.Error != nil {
		fmt.Println("❗️User not found:", result.Error)
		success = false
	}

	return user, success
}

func ValidateUser(userNameOrEmail, password string) (string, bool) {
	var user models.User
	result := database.DB.Where(&models.User{Username: userNameOrEmail}).Or(&models.User{Email: userNameOrEmail}).First(&user)
	var success bool = false
	var message string = "Successfully Logged In!"
	if result.Error != nil {
		message = "Unable to login!"
	} else if user.Username != "" || user.Email != "" {
		if utilties.CheckPasswordHash(password, user.Password) {
			message = "Successfully Authenticated!"
			success = true
		} else {
			message = "Invalid Credentials. Try again!"
		}
	} else {
		message = "User not found!"
	}
	return message, success
}

/*
func UpdateUserEmail(userID uint, newEmail string) {
	result := database.DB.Model(&models.User{}).Where("id = ?", userID).Update("email", newEmail)
	if result.Error != nil {
		fmt.Println("Error updating user email:", result.Error)
		return
	}
	fmt.Println("User email updated successfully")
}

// DeleteUser deletes a user by ID
func DeleteUser(userID uint) {
	result := database.DB.Delete(&models.User{}, userID)
	if result.Error != nil {
		fmt.Println("Error deleting user:", result.Error)
		return
	}
	fmt.Println("User deleted successfully")
}
*/
