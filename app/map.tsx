import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import { LocationInfo } from '@/types/types';
import { haversineDistance } from '@/utils/utils';
import * as Location from 'expo-location';
import { useLocalPosition } from '@/hooks/useLocalPosition';

export default function MapScreen() {
    const [locationInfo, setLocationInfo] = useState<LocationInfo>();
    const [distance, setDistance] = useState<number | null>(null);
    const [pointA, setPointA] = useState({ latitude: -34.9208, longitude: -57.9536 }); // Ejemplo de coordenadas A
    const [pointB, setPointB] = useState({ latitude: -34.9333, longitude: -57.9561 }); // Ejemplo de coordenadas B
    const [longitude] = useState(-57.95246359267004); // Ejemplo de longitud
    const [latitude] = useState(-34.95541540632269); // Ejemplo de latitud
    const [userLocation, setUserLocation] = useState<Location.LocationObject>();
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const calculatedDistance = haversineDistance(pointA.latitude, pointA.longitude, pointB.latitude, pointB.longitude);
        setDistance(calculatedDistance);
    }, [pointA, pointB]);

    useEffect(() => {
        const getUserLocation = async () => {
            const { error, userLocation } = await useLocalPosition()
            if (error) {
                setErrorMsg(error)
                return
            }
            if (userLocation) setUserLocation(userLocation)
        }
        getUserLocation()
    }, []);

    let data = 'Waiting..';
    if (errorMsg) {
        data = errorMsg;
    } else if (userLocation) {
        data = JSON.stringify(userLocation);
    }

    useEffect(() => {
        const fetchLocationInfo = async () => {
            try {
                const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client`, {
                    params: {
                        latitude,
                        longitude,
                        localityLanguage: 'es'
                    }
                });
                console.log("response.data");
                console.log(response.data);

                setLocationInfo(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchLocationInfo();
    }, [latitude, longitude]);



    return (
        <View className='flex-1'>
            <MapView
                className='flex-1 w-auto h-screen'
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                showsCompass={true}
            >
                <Marker coordinate={{ latitude, longitude }} title='Cementerio' />
                <Marker coordinate={pointA} title="Punto A"
                    draggable
                    onDragEnd={(e) => setPointA(e.nativeEvent.coordinate)}
                />
                <Marker coordinate={pointB} title="Punto B"

                    draggable
                    onDragEnd={(e) => setPointB(e.nativeEvent.coordinate)}
                />
                <Polyline
                    coordinates={[pointA, pointB]}
                    strokeColor="#e00" // Puedes cambiar el color
                    strokeWidth={5}
                />

            </MapView>
            {locationInfo && (
                <View className='p-3 absolute bottom-0 left-0 right-0 bg-[#cccccc79]'>
                    <Text>Ciudad: {locationInfo.locality}</Text>
                    <Text>Provincia: {locationInfo.principalSubdivision}</Text>
                    <Text>País: {locationInfo.countryName}</Text>
                    {distance && (<Text>Distancia: {distance.toFixed(2)} km</Text>)}
                    <Text>{data}</Text>
                </View>
            )}
        </View>
    );
};