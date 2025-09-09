package websocket

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func Upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return ws, err
	}
	return ws, nil
}

/*
// INITIAL CODES

func Reader(conn *websocket.Conn) {
	for {
		msgType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println("Error in Reading Websocket Message.", err)
		}
		data := ChatMessage{}
		json.Unmarshal(p, &data)

		fmt.Printf("Message Received: %v", data)

		data.Text = fmt.Sprintf("Reply : %s", data.Text)
		data.Id = fmt.Sprintf("R%s", data.Id)
		data.Incoming = true
		p, err = json.Marshal(data)
		if err == nil {
			err = conn.WriteMessage(msgType, p)
			if err != nil {
				log.Println("Error in Writing Websocket Message : ", err)
			} else {
				log.Println("Writing Websocket Message : ", data)
			}
		} else {
			log.Println("Error in JSONIFY Websocket REPLY Message : ", err)
		}

	}
}

func Writer(conn *websocket.Conn) {
	for {
		fmt.Println("Sending")
		messageType, r, err := conn.NextReader()
		if err != nil {
			fmt.Println(err)
			return
		}
		w, err := conn.NextWriter(messageType)
		if err != nil {
			fmt.Println(err)
			return
		}
		if _, err := io.Copy(w, r); err != nil {
			fmt.Println(err)
			return
		}
		if err := w.Close(); err != nil {
			fmt.Println(err)
			return
		}
	}
}
*/
