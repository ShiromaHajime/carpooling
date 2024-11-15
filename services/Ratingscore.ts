import { API_URL } from "@/constants/const";
import { Response, Response500 } from "@/types/errors";
import { Trip, TripById } from "@/types/types";


export const changeRating = async (id_trip: string, rating: number) => {

    const data = {
        id_trip: id_trip,
        rating: rating
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    try {
        const res = await fetch(`${API_URL}/drivers/trips/${id_trip}/requests`);
        if (res.status == 200) {
            const response = await res.json()
            return response

        } else return Response500

    } catch (error) {
        return Response500;
    }
}
