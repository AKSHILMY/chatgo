import {SystemMessageType} from "./enums.tsx";

export interface ChatInputProps {
    socket?: WebSocket
}
export interface Message{
    id?: string;
    text: string;
    timestamp?: string;
    incoming? : boolean;
    systemMessage? : SystemMessageType | undefined;
}
