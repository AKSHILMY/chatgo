import {Message} from "../utilities/props.tsx";

interface WebsocketProps {
    url: string;
    onMessage: (msg: string) => void;
    onClose: () => void;
    onOpen: () => void;
    onError: (err: Event) => void;
}

const createWebsocket = (props: WebsocketProps ) => {
    const socket = new WebSocket(props.url);

    socket.onopen = () => {
        props.onOpen()
    }
    socket.onclose = () => {
        props.onClose()
    }
    socket.onmessage = (e) => {
        props.onMessage(e.data)
    }
    socket.onerror = (e) => {
        props.onError(e)
    }
    return socket;
}

const sendMessage = (socket : WebSocket, msg? : Message): boolean => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
        return true
    } else {
        console.error("WebSocket is not open.");
    }
    return false;
};

export { createWebsocket, sendMessage };