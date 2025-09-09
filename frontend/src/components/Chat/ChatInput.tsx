import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendMessage } from "../../routes/websocket.tsx";
import { Message } from "../../utilities/props.tsx";
import moment from "moment";

interface ChatInputProps {
    socket?: WebSocket | null
    onSendMessage: (msg: Message) => void
}

const ChatInput = (props: ChatInputProps) => {
    const [msgStr, setMsgStr] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);

    const handleSendMsg = () => {
        if (!msgStr.trim()) return;

        setIsSending(true);

        const message: Message = {
            id: uuidv4(),
            text: msgStr,
            timestamp: moment().format("DD.MM.YYYY HH:mm:ss")
        };

        if (props.socket) {
            const success = sendMessage(props.socket, message);
            if (success) {
                props.onSendMessage(message);
            }

            setMsgStr(""); // Clear input after sending
        } else {
            console.error("WebSocket is not connected");
        }

        setIsSending(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMsg();
        }
    };

    return (
        <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={msgStr}
                        onChange={(e) => setMsgStr(e.target.value)}
                        onKeyUp={handleKeyPress}
                        className="w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
                        placeholder="Type a message"
                    />
                </div>

                <button
                    onClick={handleSendMsg}
                    disabled={isSending || !msgStr.trim()}
                    className={`ml-2 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        msgStr.trim()
                            ? "bg-teal-500 text-white hover:bg-teal-600"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatInput;