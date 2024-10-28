import { API_URL } from "@/constants/const";
import { Response, Response500 } from "@/types/errors";
import { Trip, TripById } from "@/types/types";


export const decisionPetition= async (id_trip: string, solicitud_id: number, decision: boolean) => {
    
    console.log("API_URL de la variable de entorno");
    console.log(API_URL);

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    let path
    if (decision){
        path = `${API_URL}/drivers/trips/${id_trip}/requests/${solicitud_id}/reject`
    }else {
        path = `${API_URL}/drivers/trips/${id_trip}/requests/${solicitud_id}/reject`;
    }
    try {
        if (!path) return Response500
        const res = await fetch(path, options);
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