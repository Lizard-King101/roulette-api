
/**
 * 0: Sent, 1: Received, 2: Seen, 3: Deleted
 */
export enum MessageStatus {
    Sent = 0,
    Received,
    Seen,
    Deleted
}

export interface Message {
    id: string;
    message: string;
    status: MessageStatus
}

export type NewMessage = Pick<Message, 'message'>;