import { API_URL } from "@/constants/const";
import { Response, Response500 } from "@/types/errors";
import { Trip, TripById } from "@/types/types";

export const getSolicitudesByID = async (id_trip: string) => {
    try {
        const res = await fetch(`${API_URL}/drivers/trips/${id_trip}/requests`);
        if (res.status == 200) {
            const data = await res.json()
            const response: Response = {
                data: data
            }
            let solicitudes = response.data.filter((item: any) => item.status === 'pending');
            return solicitudes
        } else return Response500

    } catch (error) {
        return Response500;
    }}