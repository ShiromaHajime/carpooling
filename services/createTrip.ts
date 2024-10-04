import { API_URL } from "@/constants/const";
import { Tripc } from "@/types/types";


export const createTrip = async (Tripc: Tripc) => {

    console.log("API_URL de la variable de entorno");
    console.log(API_URL);

    const url = API_URL ?? 'http://192.168.0.176:5000'; //IP DE API REST LOCAL

    const data = {
        deaparture_address: Tripc.deaparture_address,
        arrival_address: Tripc.arrival_address,
        departure_date: Tripc.departure_date,
        departure_time: Tripc.departure_time,
        available_seats:Tripc.available_seats,
        seat_price: Tripc.seat_price,
        vehicle_driver: Tripc.vehicle_driver,
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convertir meetingDTO a una cadena JSON
    };

    try {
        console.log('hace fetch');

        const res = await fetch(`${url}/trip`, options);
        console.log('tern fetch');
        console.log(res);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`); //falta manejo de errores si usuario ya existe
        }

        if (res.status == 201) {
            return res.json()
        } else return false

    } catch (error) {
        console.log(error);
        return false;
    }

}