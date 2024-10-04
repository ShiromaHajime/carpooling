import { API_URL } from "@/constants/const";
import { Response, Response500 } from "@/types/errors";
import { TripById } from "@/types/types";

export const joinTrip = async (passenger_id: string, id_trip: string): Promise<Response> => {

    console.log("API_URL de la variable de entorno");
    console.log(API_URL);

    const body = {
        passenger_id: passenger_id,
        id_trip: id_trip,
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
}

export const getTripById = async (id_trip: string): Promise<TripById | false> => {

    try {
        const res = await fetch(`${API_URL}/trip/${id_trip}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        if (res.status == 200) {
            const trip = await res.json()

            return trip
        } else return false

    } catch (error) {
        console.log(error);
        return false;
    }

}

