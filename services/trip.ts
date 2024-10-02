import { API_URL } from "@/constants/const";
import { TripFromDB } from "@/types/types";

export const joinTrip = async ({ id_passager, id_trip }: { id_passager: string, id_trip: string }) => {

    console.log("API_URL de la variable de entorno");
    console.log(API_URL);


    try {
        const res = await fetch(`${API_URL}/trip`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        if (res.status == 201) {
            return res.json()
        } else return false

    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getTripById = async (id_trip: string): Promise<TripFromDB | false> => {

    // esto segun lo que devuelve el endpoint
    // function-get_trip,-join_trip-y-add-database-tables

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

