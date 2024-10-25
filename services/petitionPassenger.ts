import { API_URL } from "@/constants/const";
import { Response, Response500 } from "@/types/errors";
import { Trip, TripById } from "@/types/types";


export const acceptPassenger= (id_trip: number, id_user: string) => {

    return true
}

export const rejectPassenger=  (id_trip:number , id_user: string) => {

    return true
}
