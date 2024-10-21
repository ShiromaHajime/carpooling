import * as Location from 'expo-location';

export const useLocalPosition = async (): Promise<{ error: string, userLocation: Location.LocationObject | undefined }> => {

    try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return { error: 'Permission to access location was denied', userLocation: undefined };
        }

        let userLocation = await Location.getCurrentPositionAsync({});
        return { error: '', userLocation: userLocation };
    } catch (error) {
        return { error: 'some error', userLocation: undefined };

    }
}