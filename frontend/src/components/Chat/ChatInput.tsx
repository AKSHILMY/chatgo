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

    const [isRecording, setIsRecording] = useState<boolean>(false);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const audioChunksRef = React.useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' }); // or audio/webm
                const audioFile = new File([audioBlob], `voice_message_${Date.now()}.wav`, { type: 'audio/wav' });

                // Simulate file input event structure or call logic directly
                // Refactoring handleFileUpload to accept File directly would be cleaner, but for now calling it with constructed event
                await uploadFile(audioFile);

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const uploadFile = async (file: File) => {
        setIsSending(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8787'}/api/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                const message: Message = {
                    id: uuidv4(),
                    text: "", // Voice message
                    timestamp: moment().format("DD.MM.YYYY HH:mm:ss"),
                    attachment_url: data.url,
                    attachment_type: "audio",
                    attachment_name: file.name
                };

                if (props.socket) {
                    sendMessage(props.socket, message);
                    props.onSendMessage(message);
                }
            } else {
                console.error("Upload failed", data);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsSending(false);
        }
    }


    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reuse upload logic if specific tweaks aren't needed, otherwise keep separate
        // For file upload, we keep the original text logic (filename as text?)
        // Let's copy-paste logic slightly modified or extract common if we wanted.
        // For expedience and slight diffs (text field), keeping inline or calling a shared helper with params.

        setIsSending(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8787'}/api/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                const message: Message = {
                    id: uuidv4(),
                    text: msgStr, // Use typed text or empty
                    timestamp: moment().format("DD.MM.YYYY HH:mm:ss"),
                    attachment_url: data.url,
                    attachment_type: data.type,
                    attachment_name: data.name
                };

                if (props.socket) {
                    sendMessage(props.socket, message);
                    props.onSendMessage(message);
                }
            } else {
                console.error("Upload failed", data);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setIsSending(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setMsgStr(""); // Clear input after upload
        }
    };

    return (
        <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-3 relative">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,application/pdf,audio/*"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSending || isRecording}
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                    title="Attach file"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                </button>

                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isSending}
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${isRecording ? "bg-red-50 text-red-500 animate-pulse" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
                    title={isRecording ? "Stop Recording" : "Record Voice Note"}
                >
                    {isRecording ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <rect x="6" y="6" width="8" height="8" rx="1" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    )}
                </button>

                <div className="flex-1 relative">
                    {isRecording ? (
                        <div className="w-full py-3 px-4 bg-red-50 text-red-500 rounded-full flex items-center">
                            <span className="animate-pulse font-medium">Recording...</span>
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={msgStr}
                            onChange={(e) => setMsgStr(e.target.value)}
                            onKeyUp={handleKeyPress}
                            className="w-full py-3 px-4 bg-gray-100 text-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
                            placeholder="Type a message"
                        />
                    )}
                </div>

                <button
                    onClick={handleSendMsg}
                    disabled={isSending || !msgStr.trim() || isRecording}
                    className={`ml-2 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${msgStr.trim() && !isRecording
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