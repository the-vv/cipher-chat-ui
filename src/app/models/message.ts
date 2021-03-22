export interface Message {
    readonly datetime: Date,
    message: string,
    readonly from: string,
    readonly to: string,
    status?: string
}
