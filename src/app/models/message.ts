export interface Message {
    _id: string,
    readonly datetime: Date,
    message: string,
    readonly from: string,
    readonly to: string,
    status?: string
}
