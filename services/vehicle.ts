import { API_URL } from "@/constants/const";
import { Vehicle } from "@/types/types";
import { getTokenFromStorage } from "./userLogin";

interface PropsCreateVehicle extends Vehicle {
    user_id: string
}

export const getVehiclesByUserID = async (idUser: string): Promise<{ vehicles?: Vehicle[], errorHttp?: number }> => {
    const idToken = await getTokenFromStorage()
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    };

    try {
        const res = await fetch(`${API_URL}/drivers/${idUser}/vehicles`, options);
        if (res.status == 200) {
            const vehiclesRes = await res.json()
            return { vehicles: vehiclesRes.vehicles }
        } else {
            return { errorHttp: res.status }
        }
    } catch (error) {
        return { errorHttp: 500 }
    }
}

export const createVehicle = async (props: PropsCreateVehicle): Promise<{ vehicle?: Vehicle, errorHttp?: number }> => {

    const data = {
        brand: props.brand,
        color: props.color,
        driver_id: props.user_id, // maybe unnecessary, data in idToken
        license_plate: props.license_plate,
        model: props.model,
        year: props.year,
    };
    const idToken = await getTokenFromStorage()
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(data)
    };

    try {
        const res = await fetch(`${API_URL}/vehicles`, options);
        if (res.status == 201) {
            const vehicle = await res.json()
            return { vehicle: vehicle }
        } else return { errorHttp: res.status }
    } catch (error) {
        return { errorHttp: 500 }
    }

}