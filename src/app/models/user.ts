export interface User {
    readonly name: string,
    readonly email: string,
    readonly _id: string,
    photo?: string,
    [props: string]: any
}
