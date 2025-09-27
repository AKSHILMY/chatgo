package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/google/uuid"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	database "github.com/uBuildIt/GoLang/chatGO/pkg/database"
	"github.com/uBuildIt/GoLang/chatGO/pkg/services"
	"github.com/uBuildIt/GoLang/chatGO/pkg/websocket"
)

func serverWebSocket(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	query := r.URL.RawQuery
	request, err := url.ParseQuery(query)
	if err != nil {
		http.Error(w, "Error parsing query", http.StatusBadRequest)
		return
	}
	username := request.Get("username")
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		log.Println(err)
	}
	client := &websocket.Client{
		Id: uuid.NewString(),
		Username: func() string {
			if username != "" {
				return username
			} else {
				return "Anonymous"
			}
		}(),
		Conn: conn,
		Pool: pool,
	}

	log.Printf("WebSocket Connection Request: %s (%s)", client.Username, username)
	pool.Register <- client
	go client.Read()
	// websocket.Reader(ws)
	// go websocket.Writer(ws)

}

func intializeEnv(mode string) {
	fmt.Printf("✨ Running in %s mode\n", strings.ToUpper(mode))
	if mode != "prod" {
		fmt.Println("📝 Env loaded from .env")
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	} else {
		fmt.Println("📝 Env loaded from prod environment")
	}

}

func intializeDB() {
	database.ConnectDB()
}

func setupAuthRoutes(router *mux.Router) {
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Chat Go v1.0.0")
	})

	router.HandleFunc("/user", services.UserOp(true))
	router.HandleFunc("/auth/login", services.AuthLogin(false))
	router.HandleFunc("/config", services.ConfigOp(false))

	/*
		http.HandleFunc("/pool", func(w http.ResponseWriter, r *http.Request) {
			switch r.Method {
			case "POST":
				services.CreatePool()
			default:
				http.Error(w, "Method Not Allowed!", http.StatusMethodNotAllowed)
			}
		})
	*/
}

func setupWebSocketRoutes(router *mux.Router) {
	poolIdentity := websocket.PoolIdentity{
		Id: uuid.NewString(),
	}
	pool := websocket.NewPool(poolIdentity)
	go pool.Start()
	router.HandleFunc("/ws-chat", func(w http.ResponseWriter, r *http.Request) {
		serverWebSocket(pool, w, r)
	})
}

func main() {
	router := mux.NewRouter()
	mode := flag.String("mode", "dev", "Run mode: dev, test, or prod")
	flag.Parse()
	intializeEnv(*mode)
	intializeDB()
	setupAuthRoutes(router)
	setupWebSocketRoutes(router)

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}), // change "*" to your domain in production
		handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)(router)

	err := http.ListenAndServe(":8080", corsHandler)
	if err != nil {
		fmt.Println("❗️Error starting server:", err)
	}

}
