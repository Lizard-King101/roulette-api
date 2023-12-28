import { UserExample } from "../../types/user-example";
import { Message, MessageStatus, NewMessage } from "./message"; 

// service for handling messages routes

export class MessageService {
    public get(id: string): Message {
        return {
            id,
            message: 'hello',
            status: MessageStatus.Seen,
            from: {
                id: 123,
                name: 'person'
            }
        }
    }

    public send(message: NewMessage, from: UserExample): Message {
        return {
            id: (new Date().getTime() + ((Math.random() * 1000000) / 1000000)).toString(16),
            message: message.message,
            status: MessageStatus.Sent,
            from
        }
    }
}