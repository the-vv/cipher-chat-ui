import { User } from "./user";

export interface Message {
    readonly _id?: string,
    message: string,
    datetime: Date,
    from: User | string,
    to: User | string,
    seen: boolean,
    read: boolean,
    hasMedia: boolean,
    isComposed?: boolean,
    media?: {
        mediaType: string,
        pid: string,
        url: string,
        thumb?: string,
        size?: string,
        name?: string
    }
}
