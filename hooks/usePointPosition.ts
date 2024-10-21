import { LocationInfo } from '@/types/types';
import axios from 'axios';
import { LatLng } from 'react-native-maps';

export const usePointPosition = async (point: LatLng): Promise<{ error: string, location: LocationInfo | null }> => {

    const latitude = point.latitude
    const longitude = point.longitude

    try {
        const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client`, {
            params: {
                latitude,
                longitude,
                localityLanguage: 'es'
            }
        });
        return { error: '', location: response.data }
    } catch (error) {
        return { error: 'api error', location: null }

    }
}