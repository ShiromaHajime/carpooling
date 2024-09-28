export interface PropsInput {
    setValueInput: Function,
    placeholder: string,
    className?: string
}

export interface UserAccount {
    name: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    mail_validation: number
}

export interface Trip {
    id: number,
    departure_address_id: number,
    departure_date: string,
    departure_time: string,
    arrival_address_id: number,
    available_seats: number,
    seat_price: number
    creation_timestamp: string,
}

export type Trips = Trip[]