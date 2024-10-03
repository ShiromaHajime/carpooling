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

export interface TripById {  // las peticiones de /trips/:id devuelven en este formato
    arrival_address: Address;
    available_seats: number;
    creation_timestamp: number;
    departure_address: Address;
    departure_date: string;
    departure_time: string;
    driver: User;
    id: number;
    seat_price: number;
    vehicle: Vehicle;
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

export interface Vehicle {
    brand: string;
    color: string;
    id: number;
    license_plate: string;
    model: string;
}

interface Vehicle_driver {
    driver: Driver;
}


interface Trip {    // las peticiones de /trip devuelven en este formato
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

