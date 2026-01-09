import { createWebsocket } from "../../routes/websocket.tsx";
import { useEffect, useRef, useState } from "react";
import ChatHistory from "./ChatHistory.tsx";
import ChatInput from "./ChatInput.tsx";
import { Message } from "../../utilities/props.tsx";
import ChatBar from "./ChatBar.tsx";
import { getLocalStorageItem } from "../../utilities/lib/localStorage.tsx";
// import AppConfig from "../../utilities/schema.tsx";

interface ChatComponentProps {
    isLoggedIn: boolean;
}

const ChatComponent = (props: ChatComponentProps) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [history, setHistory] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [systemMessage, setSystemMessage] = useState<string | null>(null);
    const username = getLocalStorageItem('username') as string;
    const imageUrl = getLocalStorageItem('image_url') as string;

    useEffect(() => {
        if (!props.isLoggedIn) {
            return;
        }
        socketRef.current = createWebsocket({
            url: `${import.meta.env.VITE_CHATGO_WEBSOCKET_URL || 'ws://localhost:8787/ws-chat'}?username=${username}`,
            onMessage: onMessage,
            onOpen: onOpen,
            onClose: onClose,
            onError: onError
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                setIsConnected(false);
            }
        };
    }, []);

    const onMessage = (data: string) => {
        const raw = JSON.parse(data);
        const msg: Message = {
            id: raw.id,
            text: raw.text,
            timestamp: raw.timestamp,
            incoming: raw.incoming,
            systemMessage: raw.system_message || undefined,
            attachment_url: raw.attachment_url,
            attachment_type: raw.attachment_type,
            attachment_name: raw.attachment_name,
        };
        if (!msg.systemMessage || msg.systemMessage.length === 0) {
            setSystemMessage(null)
            setHistory(prevHistory => [...prevHistory, msg]);
        } else {
            setSystemMessage(msg.text);
        }
    }

    const onOpen = () => {
        setIsConnected(true);
        console.log("onOpen");
    }

    const onClose = () => {
        setIsConnected(false);
        setSystemMessage(null)
        console.log("onClose");
    }

    const onError = (e: Event) => {
        setIsConnected(false);
        console.error(e);
    }

    const onSendMessage = (msg: Message) => {
        setSystemMessage(null)
        setHistory(prevHistory => [...prevHistory, msg]);
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col w-full max-w-2xl h-5/6 mx-auto rounded-lg overflow-hidden shadow-xl bg-white grid grid-rows-[auto_1fr_auto]"> {/* Changed flex-col to grid and defined grid-rows */}
                <div className="row-start-1 col-start-1 z-10">
                    <ChatBar userName={username} userImage={imageUrl} />
                    <p className="text-xs text-gray-500 italic text-center">{systemMessage}</p>
                </div>
                <div className="row-start-2 col-start-1 overflow-y-auto">
                    <ChatHistory history={history} />
                </div>
                <div className="row-start-3 col-start-1"> {/* Position ChatInput at the bottom */}
                    {isConnected ?
                        <ChatInput socket={socketRef.current} onSendMessage={onSendMessage} /> :
                        <div className="p-4 bg-gray-100 text-center">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                                <span className="text-gray-600 ml-2">Connecting to chat server...</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default ChatComponent;