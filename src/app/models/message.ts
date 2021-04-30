import { User } from "./user";

export interface Message {
    readonly _id?: string,
    message: String,
    datetime: Date,
    from: String | User,
    to: String | User,
    seen: Boolean,
    read: Boolean,
    hasMedia: Boolean,
    isComposed?: Boolean,
    media?: {
        mediaType: String,
        pid: String,
        url: String,
        thumb?: String,
        size?: String,
        name?: string
    }
}
