export interface PropsInput {
    setValueInput: Function,
    placeholder: string,
    className?: string
}

export type Users = UserAccount[]

export interface UserAccount {
    name: string,
    lastname: string,
    username: string,
    email: string,
}

export interface Trip {
    id: string;
    departureDate: string;
    departureTime: string;
    availableSeats: number;
    seatPrice: number;
    creationTimestamp: string;
    departureAddressId: string;
    arrivalAddressId: string;
    vehicleDriverId: string;
}

