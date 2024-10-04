import { API_URL } from "@/constants/const";
import { Tripc } from "@/types/types";


export const createTrip = async (Tripc: Tripc) => {

    console.log("API_URL de la variable de entorno");
    console.log(API_URL);

    const url = API_URL ?? 'http://192.168.0.176:5000'; //IP DE API REST LOCAL

    // const bodyExample = {
    //     departure_date: "2023-25-30",
    //     departure_time: "10:05",
    //     available_seats: "3",
    //     seat_price: "150.5",
    //     departure_address: "Buenos Aires, La Plata, Calle 58, 607",  // FORMATO "STRING", "STRING", "STRING"
    //     arrival_address: "Buenos Aires, La Plata, Calle 58, 843", // FORMATO "STRING", "STRING", "STRING"
    //     vehicle_driver_id: 1
    // }



    const data = {
        departure_date: Tripc.departure_date,
        departure_time: Tripc.departure_time,
        available_seats: Tripc.available_seats,
        seat_price: Tripc.seat_price,
        departure_address: Tripc.deaparture_address,
        arrival_address: Tripc.arrival_address,
        vehicle_driver_id: Tripc.idDriver
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    try {

        const res = await fetch(`${url}/trip`, options);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }

        if (res.status == 200) {
            return await res.json()
        } else return false

    } catch (error) {
        console.log(error);
        return false;
    }

}