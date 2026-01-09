import { Message } from "../../utilities/props.tsx";
import { useRef, useEffect } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
interface ChatHistoryProps {
    history?: Message[]
}

const ChatHistory = (props: ChatHistoryProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [props.history]);

    return (
        <div className="flex flex-col flex-1 z-1 h-full">
            <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                {props?.history && props.history.length > 0 ? (
                    <div className="space-y-3">
                        {props.history.map((msg: Message, index: number) => {
                            const isIncoming = msg.incoming;
                            { console.log(`msg ${msg.id}: incoming=${msg.incoming}, type=${msg.attachment_type}`) }
                            return (
                                // TODO: A SEPARATE COMPONENT
                                <div key={msg.id || index} className="flex">
                                    <div
                                        className={`relative max-w-[75%] md:max-w-md px-4 py-2 rounded-lg shadow-sm ${isIncoming
                                            ? "bg-white border border-gray-200 mr-auto"
                                            : "bg-teal-500 text-white ml-auto"
                                            }`}
                                    >
                                        <p className="text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap font-normal">
                                            {msg.text}
                                        </p>
                                        {msg.attachment_url && (
                                            <div className="mt-2">
                                                {msg.attachment_type === 'image' && (
                                                    <img src={msg.attachment_url} alt="attachment" className="rounded-lg max-w-full h-auto cursor-pointer" onClick={() => window.open(msg.attachment_url, '_blank')} />
                                                )}
                                                {msg.attachment_type === 'audio' && (
                                                    <div className={`w-full min-w-[300px] sm:min-w-[400px] mt-1 ${isIncoming ? 'audio-player-received' : 'audio-player-sent'}`}>
                                                        <AudioPlayer
                                                            src={msg.attachment_url}
                                                            autoPlay={false}
                                                            layout="horizontal-reverse"
                                                            customAdditionalControls={[]}
                                                            showJumpControls={false}
                                                            showDownloadProgress={false}
                                                            showFilledProgress={true}
                                                        />
                                                    </div>
                                                )}
                                                {msg.attachment_type === 'pdf' && (
                                                    <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-gray-100 rounded-lg text-blue-600 hover:text-blue-800 transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="truncate max-w-[150px]">{msg.attachment_name || "Document.pdf"}</span>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                        <span
                                            className={`block text-xs mt-1 text-right ${isIncoming ? "text-gray-500" : "text-teal-100"}`}>
                                            {msg.timestamp} {/* Use your formatting function */}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
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