package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	//postgresql: postgres:[YOUR-PASSWORD]@db.bzeojegjzweujjqbwwqd.supabase.co:5432/postgres
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"), os.Getenv("DB_PORT"),
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{PrepareStmt: false})
	if err != nil {
		log.Fatal("❗️Failed to connect to PostgreSQL:", err)
	}
	fmt.Println("🛜 Successfully connected to db")

	// // Auto-migrate tables
	// err = db.AutoMigrate(&models.User{})
	// if err != nil {
	// 	log.Fatal("Failed to migrate database:", err)
	// }

	DB = db
}
