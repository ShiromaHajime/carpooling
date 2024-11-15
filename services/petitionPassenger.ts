import { API_URL } from "@/constants/const";
import { Response, Response500 } from "@/types/errors";

export const decisionPetition = async (id_trip: string, id_user: string, decision: boolean) => {

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    };

    let path
    if (decision) {
        path = `${API_URL}/drivers/trips/${id_trip}/requests/${id_user}/accept`
    } else {
        path = `${API_URL}/drivers/trips/${id_trip}/requests/${id_user}/reject`;
    }
    try {
        const res = await fetch(path, options);
        if (res.status == 200) {
            const data = await res.json()
            const response: Response = {
                data: data
            }
            return response
        } else return Response500

    } catch (error) {
        console.log(error);
        return Response500;
    }
}