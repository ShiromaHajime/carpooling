import { z } from "zod";

export interface PropsInput {
    setValueInput: Function,
    placeholder: string,
    className?: string
}

export const schemaFormUser = z.object({
    name: z.string()
        .min(1, { message: "El nombre es requerido" })
        .superRefine((value, ctx) => {
            if (value.length > 0 && !isNaN(Number(value))) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El nombre no puede ser numérico",
                });
            }
        }),
    lastname: z.string()
        .min(1, { message: "El apellido es requerido" })
        .superRefine((value, ctx) => {
            if (value.length > 0 && !isNaN(Number(value))) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El apellido no puede ser numérico",
                });
            }
        }),
    email: z.string()
        .email({ message: "Correo electrónico no válido" }),
    password: z.string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    username: z.string()
        .min(1, { message: "El nombre de usuario es requerido" })
        .superRefine((value, ctx) => {
            if (value.length > 0 && !isNaN(Number(value))) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El nombre de usuario no puede ser numérico",
                });
            }
        }),

});

export type UserAccount = z.infer<typeof schemaFormUser>;


export interface PropsInput {
    setValueInput: Function,
    placeholder: string,
    className?: string
}

export type Users = UserAccount[]

// export interface Driver {
//     user_id: number;
//     username: string;
//     email: string;
//     first_name: string;
//     last_name: string;
//     password: string;
//     is_active: boolean;
//     registration_date: string;
// }

export interface TripById {
    id: number;
    departure_date: string;
    departure_address: Address;
    arrival_address: Address;
    driver: User;
}

interface Province {
    province_id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
    province: Province;
}

interface Address {
    id: number;
    street: string;
    number: number;
    city: City;
}

export interface User {
    creation_date: string;
    email: string;
    first_name: string;
    id: number;
    last_name: string;
}

interface Driver {
    id: number;
    user: User;

}

interface Vehicle_driver {
    driver: Driver;
}


interface Trip {
    arrival_address: Address;
    available_seats: number;
    creation_timestamp: number;
    deaparture_address: Address;
    departure_date: string;
    departure_time: string;
    id: number;
    seat_price: number;
    vehicle_driver: Vehicle_driver;
}

export type Trips = Trip[]

