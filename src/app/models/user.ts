export interface User {
    _id?: string,
    name: string,
    email: string,
    password?: string,
    settings: {
        encryption?: boolean,
        encryptNames?: boolean,
        encryptionComplexMode?: boolean,
        newUser?: boolean,
        encryptDelay?: Number,
        color: string,
        verified: boolean
    }
}
