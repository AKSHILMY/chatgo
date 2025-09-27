package websocket

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	ai_filters "github.com/uBuildIt/GoLang/chatGO/pkg/ai/filters"
	utilties "github.com/uBuildIt/GoLang/chatGO/pkg/utilities"
)

type PoolIdentity struct {
	Id             string `json:"id"`
	Name           string `json:"name"`
	ImageUrl       string `json:"image_url"`
	EnableSafeLang string `json:"enable_safe_lang"`
}

type Pool struct {
	Identity   PoolIdentity `json:"identity"`
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan ChatMessage
}

func NewPool(identity PoolIdentity) *Pool {
	return &Pool{
		Identity:   identity,
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan ChatMessage),
	}
}

func (pool *Pool) Start() {
	for {
		select {
		case _client := <-pool.Register:
			pool.Clients[_client] = true
			for client := range pool.Clients {
				if client.Id == _client.Id {
					continue
				}
				client.Conn.WriteJSON(ChatMessage{
					Id:            uuid.NewString(),
					Text:          fmt.Sprintf("Client %s connected to the pool\n", _client.Username),
					Timestamp:     time.Now().UTC().String(), // TODO: Timezone
					Incoming:      true,
					SenderID:      utilties.SYSTEM_SENDER_ID,
					SystemMessage: utilties.SYSTEM_CONNECT_MESSAGE,
				})
				fmt.Printf("Client %s connected to the pool\n", _client.Username)
			}
		case _client := <-pool.Unregister:
			delete(pool.Clients, _client)
			for client := range pool.Clients {
				if client.Id == _client.Id {
					continue
				}
				client.Conn.WriteJSON(ChatMessage{
					Id:            uuid.NewString(),
					Text:          fmt.Sprintf("Client %s dropped from the pool\n", _client.Username),
					Timestamp:     time.Now().UTC().String(), // TODO: Timezone
					Incoming:      true,
					SenderID:      utilties.SYSTEM_SENDER_ID,
					SystemMessage: utilties.SYSTEM_DISCONNECT_MESSAGE,
				})
				fmt.Printf("Client %s dropped from the pool\n", _client.Username)
			}
		case msg := <-pool.Broadcast:
			msg.Text = ai_filters.ProcessSafeLangFilter(msg.Text)
			for client, active := range pool.Clients {
				if active {
					msg.Incoming = true
					if client.Id == msg.SenderID {
						continue
					}
					p, err := json.Marshal(msg)
					if err == nil {
						err = client.Conn.WriteMessage(msg.Type, p)
						if err != nil {
							log.Println("Error in Writing Websocket Message : ", err)
						} else {
							fmt.Printf("Broadcasted Msg ID : %s to pool %s: \n", msg.Id, client.Pool.Identity.Name)
						}
					} else {
						log.Println("Error in JSONIFY Websocket REPLY Message : ", err)
					}
				}

			}
		}
	}
}
