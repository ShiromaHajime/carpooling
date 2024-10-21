import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Button } from "@/components/buttons/Button";
import { useRouter } from "expo-router";
import { GlobalContext } from "@/utils/Provider";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { InputStyled } from "@/components/inputs/InputStyled";
import { createTrip } from "@/services/createTrip";
import { useToast } from "@/components/Toast";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Entypo } from "@expo/vector-icons";
import { IconArrowUp } from "@/components/icons/Icons";
import { HandleHeader } from "@/components/headers/HandleHeader";
import FormTrip from "./FormTrip";
import { haversineDistance } from "@/utils/utils";
import { useLocalPosition } from "@/hooks/useLocalPosition";
import axios from "axios";
import MapView, { LatLng, MapPressEvent, Marker, Polyline } from "react-native-maps";
import * as Location from 'expo-location';
import { AlertProp, LocationInfo, modeMap } from "@/types/types";
import { AlertTriangle, Terminal, Locate } from "lucide-react-native";
import { Alert, AlertDescription, AlertTitle } from "@/components/Alert";
import { usePointPosition } from "@/hooks/usePointPosition";
import { useColorScheme } from "nativewind";
import { AlertSelecting } from "@/components/alerts/AlertSelecting";


export default function CreateTripScreen() {


    const InitialRegion = {
        latitude: -34.95541540632269,
        longitude: -57.95246359267004,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }

    const [locationInfo, setLocationInfo] = useState<LocationInfo>();
    const [distance, setDistance] = useState<number | null>(null);
    const [origin, setOrigin] = useState<LatLng | null>(null);
    const [destination, setDestination] = useState<LatLng | null>(null);
    const [mode, setMode] = useState<modeMap>('iddle');
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>();
    const [originLocation, setOriginLocation] = useState<LocationInfo | null>();
    const [destinationLocation, setDestinationLocation] = useState<LocationInfo | null>();
    const [errorMsg, setErrorMsg] = useState('');
    const [currentRegion, setCurrentRegion] = useState(InitialRegion);
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');
    const [indexSheet, setIndexSheet] = useState(1);

    useEffect(() => {
        if (origin && destination) {
            const calculatedDistance = haversineDistance(origin.latitude, origin.longitude, destination.latitude, destination.longitude);
            setDistance(calculatedDistance);
        }
    }, [origin, destination]);

    useEffect(() => {
        const getUserLocation = async () => {
            const { error, userLocation } = await useLocalPosition()
            setErrorMsg(error)
            setUserLocation(userLocation)
        }
        getUserLocation()
    }, []);


    useEffect(() => {
        const fetchLocationInfo = async () => {
            if (!origin) return
            const { error, location } = await usePointPosition(origin)
            if (error) setErrorMsg('hubo un error')
            setOriginLocation(location)
        };
        fetchLocationInfo();
    }, [origin]);

    useEffect(() => {
        const fetchLocationInfo = async () => {
            if (!destination) return
            const { error, location } = await usePointPosition(destination)
            if (error) setErrorMsg('hubo un error')
            setDestinationLocation(location)
        };
        fetchLocationInfo();
    }, [destination]);



    const snapPoints = ["20%", "40", "90%"]
    const bottomSheetRef = useRef<BottomSheet>(null);
    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        setIndexSheet(index)
    }, []);



    const SelectPoints = () => {

        const strDestination = destinationLocation ? destinationLocation.locality + ', ' + destinationLocation.principalSubdivision + ', ' + destinationLocation.countryName : ''
        const strOrigin = originLocation ? originLocation.locality + ', ' + originLocation.principalSubdivision + ', ' + originLocation.countryName : 'Tu ubicación '

        return (
            <View className="flex h-full px-5">

                <View className="mt-4 mb-6 flex-row justify-between items-center" >
                    <View>
                        <Text className="text-md font-medium text-foreground mb-2">
                            Lugar de inicio del viaje
                        </Text>

                        <InputStyled
                            className="max-w-[190px] overflow-hidden whitespace-nowrap text-ellipsis self-start bg-slate-50 dark:bg-background"
                            valueInput={strOrigin}
                            setValueInput={setDeparture}
                            placeholder="A dónde queres ir?"
                        />
                    </View>

                    <Button className="mt-7" onPress={() => setMode('selectingOrigin')}
                        label="Marcar origen" />
                </View>

                <View className="mt-4 mb-6 flex-row justify-between items-center" >
                    <View>
                        <Text className="text-md font-medium mb-2 dark:text-slate-100"
                        >Lugar de finalización del viaje</Text>
                        <InputStyled
                            className="max-w-[190px] overflow-hidden whitespace-nowrap text-ellipsis self-start bg-slate-50 dark:bg-background "
                            valueInput={strDestination}
                            setValueInput={setArrival}
                            placeholder="A dónde queres ir?"
                        />

                    </View>
                    <Button className="mt-7" onPress={() => setMode('selectingDestination')}
                        label="Marcar destino" />
                </View>
            </View>
        )
    }


    const handleClickMap = (e: MapPressEvent) => {
        const coordPressed = e.nativeEvent.coordinate
        if (mode == 'selectingOrigin') setOrigin(coordPressed)
        if (mode == 'selectingDestination') {
            if (!origin) setOrigin(userLocation?.coords ? userLocation.coords : null)
            setDestination(coordPressed)
            bottomSheetRef.current?.snapToIndex(2)
            setIndexSheet(2)
        }
        bottomSheetRef.current?.snapToIndex(1)
        setIndexSheet(1)
        setMode('end')

    }

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <View className="bg-background flex h-full dark:bg-gray-900 ">
                {(mode == 'selectingOrigin') && (<AlertSelecting title='Marcando punto de origen' description='Para marcar un punto puedes tocar el mapa' />)}
                {(mode == 'selectingDestination') && (<AlertSelecting title='Marcando punto de destino' description='Para marcar un punto puedes tocar el mapa' />)}
                <View className='flex-1'>
                    <MapView
                        userInterfaceStyle="dark"
                        className='flex-1 w-auto h-screen bg-background'
                        style={{ flex: 1 }}
                        initialRegion={InitialRegion}
                        region={currentRegion}
                        showsUserLocation={true}
                        showsCompass={true}
                        onPress={(e) => handleClickMap(e)}
                    >
                        {(origin) && (
                            <Marker coordinate={origin} title="Origen"
                                draggable
                                onDragEnd={(e) => setOrigin(e.nativeEvent.coordinate)}
                            />
                        )}
                        {(destination) && (

                            <Marker coordinate={destination} title="Destino"
                                draggable
                                onDragEnd={(e) => setDestination(e.nativeEvent.coordinate)}
                            />
                        )}
                        {(origin && destination) && ( // Pinta linea origen-destino
                            <Polyline
                                coordinates={[origin, destination]}
                                strokeColor="#e00"
                                strokeWidth={5}
                            />
                        )}

                    </MapView>
                    {locationInfo && (
                        <View className='p-3 absolute bottom-36 left-0 right-0 bg-[#cccccc79]'>
                            <Text>Ciudad: {locationInfo.locality}</Text>
                            <Text>Provincia: {locationInfo.principalSubdivision}</Text>
                            <Text>País: {locationInfo.countryName}</Text>
                            {distance && (<Text>Distancia: {distance.toFixed(2)} km</Text>)}
                        </View>
                    )}
                </View>

                <BottomSheet
                    ref={bottomSheetRef}
                    index={indexSheet}
                    onChange={handleSheetChanges}
                    snapPoints={snapPoints}
                    handleComponent={() => (<HandleHeader />)}
                >
                    <BottomSheetView style={{ flex: 1, height: 700, alignItems: "center" }}
                        className="bg-[#f8f8f8] dark:bg-background">
                        <View>
                            {(indexSheet == 0 || indexSheet == 1) && (<SelectPoints />)}
                            {(indexSheet > 1 && (<FormTrip />))}
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </ScrollView>
    );
}