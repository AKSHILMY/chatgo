import {Message} from "../../utilities/props.tsx";
import {useRef, useEffect} from "react";
interface ChatHistoryProps {
    history?: Message[]
}

const ChatHistory = (props: ChatHistoryProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [props.history]);

    return (
        <div className="flex flex-col flex-1 z-1 h-full">
            <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                {props?.history && props.history.length > 0 ? (
                    <div className="space-y-3">
                        {props.history.map((msg: Message, index: number) => {
                            const isIncoming = msg.incoming;
                            {console.log(`msg ${msg.incoming}`)}
                            return (
                                // TODO: A SEPARATE COMPONENT
                                <div key={msg.id || index} className="flex">
                                    <div
                                        className={`relative max-w-xs px-4 py-2 rounded-lg shadow-sm ${
                                            isIncoming
                                                ? "bg-white border border-gray-200 mr-auto"
                                                : "bg-teal-500 text-white ml-auto"
                                        }`}
                                    >
                                        <p className={`${isIncoming ? "text-gray-800" : "text-white"} break-words whitespace-pre-wrap`}>{msg.text}</p>
                                        <span
                                            className={`block text-xs mt-1 text-right ${isIncoming ? "text-gray-500" : "text-teal-100"}`}>
                                            {msg.timestamp} {/* Use your formatting function */}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef}/>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-gray-400 text-center">No messages yet. Start a conversation!</p>
                    </div>
                )}
            </div>
        </div>

    );
}

export default ChatHistory;