import { API_URL } from "@/constants/const";
import { Vehicle } from "@/types/types";

interface PropsCreateVehicle extends Vehicle {
    user_id: number
}
export const createVehicle = async (props: PropsCreateVehicle) => {

    const data = {
        brand: props.brand,
        color: props.color,
        driver_id: props.user_id,
        license_plate: props.license_plate,
        model: props.model,
        year: props.year,
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    try {
        const res = await fetch(`${API_URL}/vehicles`, options);
        console.log(res);

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