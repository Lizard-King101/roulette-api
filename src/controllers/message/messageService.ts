
import { Message, MessageStatus, NewMessage } from "./message"; 

export class MessageService {
    public get(id: string): Message {
        return {
            id,
            message: 'hello',
            status: MessageStatus.Seen
        }
    }

    public send(message: NewMessage): Message {
        return {
            id: (new Date().getTime() + ((Math.random() * 1000000) / 1000000)).toString(16),
            message: message.message,
            status: MessageStatus.Sent
        }
    }
}