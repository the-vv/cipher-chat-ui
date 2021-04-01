export interface Message {
    readonly _id?: string,
    readonly datetime?: Date,
    readonly message: string,
    readonly from: string,
    readonly to: string,
    readonly fromId?: string,
    readonly toId?: string,
    status?: string
}
