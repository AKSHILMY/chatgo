package websocket

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	Id             string
	Conn           *websocket.Conn
	Pool           *Pool
	EnableSafeLang bool
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		msgType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		msg := ChatMessage{}
		json.Unmarshal(p, &msg)
		msg.Type = msgType
		msg.SenderID = c.Id

		c.Pool.Broadcast <- msg
		fmt.Printf("Message received from Client ID : %s \n", c.Id)
	}

}
