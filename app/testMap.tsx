import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { LocationInfo } from '@/types/types';
import { haversineDistance } from '@/utils/utils';

export const MapScreen = () => {
    const [locationInfo, setLocationInfo] = useState<LocationInfo>();
    const [distance, setDistance] = useState<number | null>(null);
    const [pointA, setPointA] = useState({ latitude: -34.9208, longitude: -57.9536 }); // Ejemplo de coordenadas A
    const [pointB, setPointB] = useState({ latitude: -34.9333, longitude: -57.9561 }); // Ejemplo de coordenadas B
    const [longitude] = useState(-57.95246359267004); // Ejemplo de longitud
    const [latitude] = useState(-34.95541540632269); // Ejemplo de latitud

    useEffect(() => {
        const calculatedDistance = haversineDistance(pointA.latitude, pointA.longitude, pointB.latitude, pointB.longitude);
        setDistance(calculatedDistance);
    }, [pointA, pointB]);
    useEffect(() => {
        const fetchLocationInfo = async () => {
            try {
                const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client`, {
                    params: {
                        latitude,
                        longitude,
                        localityLanguage: 'es' // Cambia a 'en' si quieres en inglés
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
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
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
            </MapView>
            {locationInfo && (
                <View style={styles.info}>
                    <Text>Ciudad: {locationInfo.locality}</Text>
                    <Text>Provincia: {locationInfo.principalSubdivision}</Text>
                    <Text>País: {locationInfo.countryName}</Text>
                    {distance && (<Text>Distancia: {distance.toFixed(2)} km</Text>)}


                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '80%',
    },
    info: {
        padding: 10,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default MapScreen;