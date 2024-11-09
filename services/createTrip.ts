import { API_URL } from "@/constants/const";
import { PlaceJsonv2 } from "@/types/addressNominatim";
import { TripById } from "@/types/types";

interface ParamsCreateTrip {
    idDriver: string,
    idVehicle: number,
    origin: PlaceJsonv2,
    destination: PlaceJsonv2,
    departure_date: string,
    departure_time: string,
    available_seats: number,
    seat_price: number
}

interface AddressApi {
    street?: string,
    number?: string,
    latitude: string,
    longitude: string,
    locality_name: string,
    principal_subdivision: string,
    country: string,
}

const parseAddress = (address: PlaceJsonv2): AddressApi => {

    const parsedAddress: AddressApi = {
        latitude: address.lat,
        longitude: address.lon,
        number: address.address.house_number,
        street: address.address.road,
        locality_name: address.address.city ?? address.address.town ?? '',
        principal_subdivision: address.address.state,
        country: address.address.country
    }
    return parsedAddress
}

export const createTrip = async (
    {
        idDriver,
        idVehicle,
        origin,
        destination,
        available_seats,
        departure_date,
        departure_time,
        seat_price
    }: ParamsCreateTrip): Promise<{ error?: { httpCode: number, message: string }, trip?: TripById }> => {

    const url = API_URL ?? 'http://192.168.0.176:5000';

    const data = {
        driver_id: idDriver,
        vehicle_id: idVehicle,
        departure_address: parseAddress(origin),
        arrival_address: parseAddress(destination),
        departure_date: departure_date, // must be %Y-%m-%d
        departure_time, // must be hh:mm:ss
        available_seats,
        seat_price
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    try {
        const res = await fetch(`${url}/trips/`, options);
        const reponse = await res.json()
        console.log("reponse ", reponse);
        if (res.status == 201) return { trip: reponse }
        if (res.status == 500) return { error: { httpCode: res.status, message: 'Error de servidor' } }
        if (res.status == 400) return { error: { httpCode: res.status, message: reponse.message } }
        return { error: { httpCode: res.status, message: reponse.message } }
    } catch (error) {
        return { error: { httpCode: 500, message: 'Error desconocido de servidor' } };
    }

}