import { LatLng } from "react-native-maps";
import { number, z } from "zod";

export interface PropsInput {
    setValueInput: Function,
    valueInput?: string
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

interface VehicleDriver {
    id: number;
    driver: Driver;
    vehicle: Vehicle;
}

export interface TripById {  // las peticiones de /trips/id devuelven en este formato
    id: number;
    departure_date: string; // Consider using Date type if parsing the date
    departure_time: string; // You might want to parse this into a Date object as well
    seat_price: number;
    available_seats: number;
    creation_timestamp: number; // Consider changing this to a Date type if it represents a timestamp
    departure_address: Address;
    arrival_address: Address;
    vehicle_driver: VehicleDriver;
}

export interface User {
    creation_date: string;
    email: string;
    first_name: string;
    id: number;
    last_name: string;
}

export interface Driver {
    id: number;
    user: User;
}

export const schemaFormVehicle = z.object({
    brand: z.string()
        .min(1, { message: "La marca es requerida" })
        .superRefine((value, ctx) => {
            if (value.length > 0 && !isNaN(Number(value))) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El nombre no puede ser numérico",
                });
            }
        }),
    license_plate: z.string()
        .min(1, { message: "El numero de patente es requerido" })
        .superRefine((value, ctx) => {
            if (value.length > 0 && !isNaN(Number(value))) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Formato incorrecto",
                });
            }
        }),
    model: z.string()
        .min(1, { message: "El modelo es requerido" })
        .superRefine((value, ctx) => {
            if (value.length > 0 && !isNaN(Number(value))) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El modelo no puede ser numérico",
                });
            }
        }),
    year: z.string()
        .min(1, { message: "El año es requerido" }),

    color: z.string()
        .min(1, { message: "El Color es requerido" })
        .superRefine((value, ctx) => {
            if (value.length > 0 && !isNaN(Number(value))) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El color no puede ser numérico",
                });
            }
        })
    ,
});

export type Vehicle = z.infer<typeof schemaFormVehicle>;

export interface Vehicle_driver {
    id: number;
    driver: Driver;
    vehicle: Vehicle;
}

export interface Trip {    // las peticiones de /trips devuelven en este formato
    arrival_address: Address;
    departure_address: Address;
    available_seats: number;
    creation_timestamp: number;
    departure_date: string;
    departure_time: string;
    id: number;
    seat_price: number;
    vehicle_driver: Vehicle_driver;
}

export type Trips = Trip[]

export interface Address {
    id: number,
    locality: Locality,
    number: number,
    street: string,
    coords: LatLng
}

export interface Locality {
    id: number,
    name: string,
    principal_subdivision: { name: string }
}

export interface LocationInfo {
    locality: string,
    principalSubdivision: string,
    city: string,
    countryName: string,
    continent: string,
    latitude: number,
    longitude: number,
    continentCode: string,
    postcode: string
}
export type modeMap = 'iddle' | 'selectingOrigin' | 'selectingDestination' | 'end'
export interface AlertProp { title: string, description: string }


export interface RoomMessage {
    id_user: number,
    username: string,
    room: string,
    message: string,
    isSystem?: boolean
    sendedTime?: string
}
export interface MessageRes extends RoomMessage {
    id: number
}

export interface ImageType { uri: string, filename: string }