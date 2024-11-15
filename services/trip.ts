import { API_URL } from "@/constants/const";
import { Response, Response500 } from "@/types/errors";
import { Trip, TripById } from "@/types/types";

interface TripsFromDB {

}
export const getAllTrips = async (): Promise<Trip[] | false> => {

    try {
        const res = await fetch(`${API_URL}/trips/`);
        if (res.status == 200) {
            const trip = await res.json()
            console.log(trip[0]);
            return trip
        }
        return false

    } catch (error) {
        console.log(error);
        return false;
    }

}

export const getHistoryTrips = async (id_user: string): Promise<[] | false> => {
        try {
            const res = await fetch(`${API_URL}/trips/${id_user}/user`);
            if (res.status == 200) {
                const trip = await res.json()
                return trip
            }
            return false
    
        } catch (error) {
            console.log(error);
            return false;
        }
}


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
        const res = await fetch(`${API_URL}/trips/${id_trip}`);

        if (res.status == 200) {
            const trip = await res.json()

            return trip
        }
        return false

    } catch (error) {
        console.log(error);
        return false;
    }

}

export const cancelTrip = async (id_trip: number, driver_id: any) => {

    const body = {
        "driver_id": driver_id
    }
    console.log("body");
    console.log(body);

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    try {
        const res = await fetch(`${API_URL}/drivers/trips/${id_trip}/cancel`, options);

        if (res.status == 200) {
            // const trip = await res.json()
            console.log(await res.json());
            return true
        }
        return false

    } catch (error) {
        console.log(error);
        return false
    }

}