import { API_URL } from "@/constants/const";
import { Response, Response500 } from "@/types/errors";
import { Trip, TripById } from "@/types/types";


export const acceptPassenger= async (id_trip: number, id_user: string, decision: boolean) => {
    
    console.log("API_URL de la variable de entorno");
    console.log(API_URL);

    const body = {
        id_trip: id_trip,
        passenger_id: id_user,
        decision: decision,
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    try {
        const res = await fetch(`${API_URL}/trip_join`, options);
        if (res.status == 200) {
            const data = await res.json()
            const response: Response = {
                data: data
            }
            return response
        } else return Response500

    } catch (error) {

        return Response500;
    }
    return true
}

export const rejectPassenger=  (id_trip:number , id_user: string) => {

    return true
}
