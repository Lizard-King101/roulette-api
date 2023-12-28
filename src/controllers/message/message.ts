// Type definitions for routes

import { UserExample } from "../../types/user-example";

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
    status: MessageStatus;
    from: UserExample;
}

export type NewMessage = Pick<Message, 'message'>;