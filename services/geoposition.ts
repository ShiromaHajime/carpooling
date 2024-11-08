import { Location, PlaceJsonv2 } from '@/types/addressNominatim';
import axios from 'axios';
import { LatLng } from 'react-native-maps';

export const getAddressByCoors = async (coord: LatLng): Promise<{ error?: string, address?: PlaceJsonv2 }> => {

    const latitude = coord.latitude
    const longitude = coord.longitude

    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?addressdetails=1&format=jsonv2&lat=${latitude}&lon=${longitude}`);
        return { address: response.data }
    } catch (error) {
        return { error: 'api error' }

    }
}

export const searchAddressNominatim = async (inputSearch: string, limit?: number): Promise<{ error?: string, address?: PlaceJsonv2[] }> => {

    try { // country ar for best results
        const encodedSearch = encodeURIComponent(inputSearch);
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?addressdetails=1&q=${encodedSearch}&format=jsonv2&countrycodes=ar${limit ? '&limit=' + limit : ''}`);
        return { address: response.data }
    } catch (error) {
        console.log(error);
        return { error: 'api error' }
    }
}