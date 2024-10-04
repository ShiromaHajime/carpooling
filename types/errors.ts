
export interface Error {
    status: number,
    msgError?: string
}

export interface Response {
    data?: any,
    error?: Error
}

export const Response500: Response = {
    error: {
        status: 500,
        msgError: 'Hubo un error'
    }
}