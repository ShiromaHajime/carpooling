import { ScrollView, Text, View } from "react-native"
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

    const [locationInfo, setLocationInfo] = useState<LocationInfo>();
    const [distance, setDistance] = useState<number | undefined>(undefined);
    const [origin, setOrigin] = useState<LatLng | undefined>(undefined);
    const [destination, setDestination] = useState<LatLng | undefined>(undefined);
    const [mode, setMode] = useState<modeMap>('iddle');
    const [userLocation, setUserLocation] = useState<ExpoLocation.LocationObject | undefined>();
    const [originLocation, setOriginLocation] = useState<PlaceJsonv2 | undefined>();
    const [destinationLocation, setDestinationLocation] = useState<PlaceJsonv2 | undefined>();
    const [errorMsg, setErrorMsg] = useState('');
    const [currentRegion, setCurrentRegion] = useState(InitialRegion);
    const [indexSheet, setIndexSheet] = useState(1);
    const originRef = useRef<PlaceJsonv2>()
    const destinationRef = useRef<PlaceJsonv2>()

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
            console.log("userLocation");
            console.log(userLocation);
            setUserLocation(userLocation)
        }
        getUserLocation()
    }, []);


    useEffect(() => {
        const fetchLocationInfo = async () => {
            if (!origin) return
            const { error, address } = await getAddressByCoors(origin)
            if (error) {
                setErrorMsg('hubo un error')
                return
            }
            if (address) {
                setOriginLocation(address)
                originRef.current = address
            }

        };
        fetchLocationInfo();
    }, [origin]);

    useEffect(() => {
        const fetchLocationInfo = async () => {
            if (!destination) return
            const { error, address } = await getAddressByCoors(destination)
            if (error) {
                setErrorMsg('hubo un error')
                return
            }
            if (address) {
                setDestinationLocation(address)
                destinationRef.current = address
            }
        };
        fetchLocationInfo();
    }, [destination]);



    const snapPoints = ["20%", "37%", "90%"]
    const bottomSheetRef = useRef<BottomSheet>(null);
    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        setIndexSheet(index)
    }, []);




    const handleClickMap = (e: MapPressEvent) => {
        const coordPressed = e.nativeEvent.coordinate
        if (mode == 'selectingOrigin') setOrigin(coordPressed)
        if (mode == 'selectingDestination') {
            setOrigin(userLocation?.coords ? userLocation.coords : undefined)
            setDestination(coordPressed)
            setTimeout(() => {
                bottomSheetRef.current?.snapToIndex(2)
            }, 500);
        }
        bottomSheetRef.current?.snapToIndex(1)
        setMode('end')
    }

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }}>
            <View className="bg-background flex h-full dark:bg-gray-900 ">
                {(mode == 'selectingOrigin') && (<AlertSelecting title='Marcando punto de origen' description='Para marcar un punto puedes tocar el mapa' />)}
                {(mode == 'selectingDestination') && (<AlertSelecting title='Marcando punto de destino' description='Para marcar un punto puedes tocar el mapa' />)}
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