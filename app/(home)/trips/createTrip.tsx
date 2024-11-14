import { Text, TouchableOpacity, View } from "react-native"
import { ScrollView } from 'react-native-virtualized-view'
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/Toast";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { HandleHeader } from "@/components/headers/HandleHeader";
import FormTrip from "./components/FormTrip";
import { haversineDistance } from "@/utils/utils";
import { useLocalPosition } from "@/hooks/useLocalPosition";
import MapView, { Callout, LatLng, MapPressEvent, Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import * as ExpoLocation from 'expo-location';
import { LocationInfo, modeMap } from "@/types/types";
import { AlertSelecting } from "@/components/alerts/AlertSelecting";
import { PlaceJsonv2 } from "@/types/addressNominatim";
import { IconMarkerPin } from "@/components/icons/Icons";
import { getAddressByCoors } from "@/services/geoposition";
import { SelectPoints } from "./components/Search";

export default function CreateTripScreen() {


    const InitialRegion = {
        latitude: -34.95541540632269,
        longitude: -57.95246359267004,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }

    const [origin, setOrigin] = useState<LatLng | undefined>(undefined);
    const [destination, setDestination] = useState<LatLng | undefined>(undefined);
    const [mode, setMode] = useState<modeMap>('iddle');
    const [userLocation, setUserLocation] = useState<PlaceJsonv2 | undefined>();
    const [originLocation, setOriginLocation] = useState<PlaceJsonv2 | undefined>();
    const [destinationLocation, setDestinationLocation] = useState<PlaceJsonv2 | undefined>();
    const [errorMsg, setErrorMsg] = useState('');
    const [currentRegion, setCurrentRegion] = useState(InitialRegion);
    const [indexSheet, setIndexSheet] = useState(1);
    const originRef = useRef<PlaceJsonv2>()
    const destinationRef = useRef<PlaceJsonv2>()
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = ["20%", "37%", "90%"]
    const { toast } = useToast()

    // console.log('render MapView');

    useEffect(() => {
        // console.log('useEffect getUserLocation');

        const getUserLocation = async () => {
            const { error, userLocation } = await useLocalPosition()
            if (error) return toast('Hubo un error al obtener tu ubicación', 'destructive', 4500, 'top', false)
            if (userLocation) {
                const { address, error } = await getAddressByCoors({ latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude })
                if (error) return toast('Hubo un error al obtener la direccion de tu ubicación', 'destructive', 4500, 'top', false)
                if (address) {
                    originRef.current = address
                    setOriginLocation(address)
                    setOrigin({
                        latitude: parseFloat(address.lat),
                        longitude: parseFloat(address.lon),
                    })
                    setUserLocation(address)
                }
            }
        }
        getUserLocation()
    }, []);


    useEffect(() => {
        const fetchLocationInfo = async () => {
            if (!origin) return
            if (userLocation) {
                const lat = parseFloat(userLocation.lat)
                const lon = parseFloat(userLocation.lon)
                console.log(lat, lon);
                console.log(origin.latitude, origin.longitude);
                if (lat == origin.latitude && lon == origin.longitude) {
                    return
                }
            }
            // console.log('hace getAddressByCoors en useEffect fetchLocationInfo origin');

            const { error, address } = await getAddressByCoors(origin)
            if (error) {
                setErrorMsg('hubo un error')
                return toast('Hubo un error buscando la direccion de origen', 'destructive', 4500, 'top', false)
            }
            if (address) {
                setOriginLocation(address)
                originRef.current = address
            }
        };


        fetchLocationInfo();
    }, [origin]);

    useEffect(() => {
        // console.log('useEffect fetchLocationInfo destination');

        const fetchLocationInfo = async () => {
            if (!destination) return
            const { error, address } = await getAddressByCoors(destination)
            if (error) {
                setErrorMsg('hubo un error')
                return toast('Hubo un error buscando la direccion de destino', 'destructive', 4500, 'top', false)
            }
            if (address) {
                setDestinationLocation(address)
                destinationRef.current = address
            }
        };
        fetchLocationInfo();
    }, [destination]);


    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        setIndexSheet(index)
    }, []);




    const handleClickMap = (e: MapPressEvent) => {
        const coordPressed = e.nativeEvent.coordinate
        if (mode == 'selectingOrigin') setOrigin(coordPressed)
        if (mode == 'selectingDestination') {
            setDestination(coordPressed)
            setTimeout(() => {
                bottomSheetRef.current?.snapToPosition("90%")
            }, 3500);
        }
        setMode('end')
    }

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <View className="bg-background flex h-full dark:bg-gray-900 ">
                {(mode == 'selectingOrigin') && (
                    <View className="pt-6 bg-background">
                        <AlertSelecting title='Marcando punto de origen' description='Para marcar un punto puedes tocar el mapa' />
                    </View>)}
                {(mode == 'selectingDestination') && (
                    <View className="pt-6 bg-background">
                        <AlertSelecting title='Marcando punto de destino' description='Para marcar un punto puedes tocar el mapa' />
                    </View>
                )}
                <View className='flex-1'>

                    <MapView
                        provider={PROVIDER_GOOGLE}
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
                            <Marker coordinate={origin}
                                draggable
                                onDragEnd={(e) => setOrigin(e.nativeEvent.coordinate)}
                            >
                                <View className="flex flex-col justify-center items-center">
                                    <Text className="font-medium">Origen</Text>
                                    <IconMarkerPin color="#fe0032" />
                                </View>
                            </Marker>
                        )}
                        {(destination) && (

                            <Marker coordinate={destination}
                                draggable
                                onDragEnd={(e) => setDestination(e.nativeEvent.coordinate)}
                            >
                                <View className="flex flex-col justify-center items-center">
                                    <Text className="font-medium">Destino</Text>
                                    <IconMarkerPin color="#fe0032" />
                                </View>
                            </Marker>
                        )}
                        {(origin && destination) && ( // Pinta linea origen-destino
                            <Polyline
                                coordinates={[origin, destination]}
                                strokeColor="#e00"
                                strokeWidth={5}
                            />
                        )}

                    </MapView>
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
                        <View className="px-4">
                            {(indexSheet == 0 || indexSheet == 1 || (!originLocation || !destinationLocation)) && (
                                <SelectPoints destinationLocation={destinationLocation} destinationRef={destinationRef}
                                    originLocation={originLocation} originRef={originRef}
                                    setDestination={setDestination} setMode={setMode}
                                    setOrigin={setOrigin}
                                />)
                            }
                            {((indexSheet > 1 && (originLocation && destinationLocation)) && (<FormTrip origin={originRef.current} destination={destinationRef.current} />))}
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </ScrollView>
    );
}