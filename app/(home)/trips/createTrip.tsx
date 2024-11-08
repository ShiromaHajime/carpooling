import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Button } from "@/components/buttons/Button";
import { GlobalContext } from "@/utils/Provider";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { InputStyled } from "@/components/inputs/InputStyled";
import { useToast } from "@/components/Toast";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { HandleHeader } from "@/components/headers/HandleHeader";
import FormTrip from "./FormTrip";
import { haversineDistance } from "@/utils/utils";
import { useLocalPosition } from "@/hooks/useLocalPosition";
import MapView, { Callout, LatLng, MapPressEvent, Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import * as ExpoLocation from 'expo-location';
import { LocationInfo, modeMap } from "@/types/types";
import { AlertSelecting } from "@/components/alerts/AlertSelecting";
import { Feature, Location, PlaceJsonv2 } from "@/types/addressNominatim";
import { InputAddress } from "@/components/inputs/InputAddress";
import { IconMarker, IconMarkerPin } from "@/components/icons/Icons";
import { getAddressByCoors, searchAddressNominatim } from "@/services/geoposition";


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



    const SearchInputAddress = ({ initialInput, isOrigin, placeholder }: { initialInput: string, isOrigin: boolean, placeholder: string }) => {

        const [isFocus, setIsFocus] = useState(false);
        const [searchText, setSearchText] = useState('');
        const [debouncedText, setDebouncedText] = useState('');
        const [addressList, setAddressList] = useState<PlaceJsonv2[]>([]);
        const [addressSelected, setAddressSelected] = useState('');

        console.log("searchText");
        console.log(searchText);



        useEffect(() => {
            // Crear un temporizador que actualice el valor debounced después de 350ms
            const timerId = setTimeout(() => {
                if (searchText != initialInput && searchText != addressSelected) { // avoid innecesary requests
                    setDebouncedText(searchText);
                    setAddressSelected('')
                }
            }, 350);

            // Limpiar el temporizador si el texto cambia antes de los 350ms
            return () => {
                clearTimeout(timerId);
            };
        }, [searchText]);

        useEffect(() => {
            const searchAddress = async () => {
                const { address, error } = await searchAddressNominatim(debouncedText, 5)
                if (error) return
                if (address) {
                    console.log(JSON.stringify(address));
                    setAddressList(address)
                }
            }

            if (debouncedText) {
                console.log("Realizar búsqueda con:", debouncedText);
                searchAddress()
            }
        }, [debouncedText]);

        const handleOnFocus = () => {
            setIsFocus(true)
        }
        const handleOnBlur = () => {
            if (addressSelected) {
                setIsFocus(false);
            }
        }

        const handleSelectAddress = (address: PlaceJsonv2) => {
            if (isOrigin) {
                originRef.current = address
                setOrigin({ latitude: parseFloat(address.lat), longitude: parseFloat(address.lon) })
            } else {
                destinationRef.current = address
                setDestination({ latitude: parseFloat(address.lat), longitude: parseFloat(address.lon) })
            }
            setSearchText(address.display_name)
            setAddressSelected(address.display_name)
        }

        return (
            <View className="mr-12">
                <InputAddress
                    className="min-w-[250px] self-startbg-slate-50 dark:bg-background"
                    valueInput={searchText}
                    setValueInput={setSearchText}
                    handleOnFocus={handleOnFocus}
                    handleOnBlur={handleOnBlur}
                    placeholder={placeholder}
                />

                {(!addressSelected && isFocus) &&
                    (addressList.length > 0) && (
                        <View className="bg-card p-2 flex flex-col gap-2 border border-border mt-2">
                            {addressList.map((address) => (
                                <TouchableOpacity onPress={() => handleSelectAddress(address)} className="z-50">
                                    <Text numberOfLines={2} className="text-foreground">{address.display_name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )
                }
            </View>

        )
    }

    const SelectPoints = () => {

        const strOrigin = originLocation ? originLocation.display_name : ''
        const truncatedTextOrigin = strOrigin.length > 35 ? strOrigin.substring(0, 40) + '...' : strOrigin;
        const strDestination = destinationLocation ? destinationLocation.display_name : ''
        const truncatedTextDestination = strDestination.length > 35 ? strDestination.substring(0, 40) + '...' : strDestination;

        return (
            <View className="flex h-full px-1">
                <View className="mt-4 mb-6 flex-row justify-between items-center relative" >
                    <View className="flex-1">
                        <Text className="text-md font-medium text-foreground mb-2">
                            Lugar de inicio del viaje
                        </Text>
                        <SearchInputAddress initialInput={truncatedTextOrigin} isOrigin={true} placeholder='Desde dónde queres viajar?' />
                    </View>
                    <View className="mt-7 absolute top-2 right-[-2]">
                        <TouchableOpacity onPress={() => setMode('selectingOrigin')}>
                            <IconMarker />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mt-3 mb-6 flex-row justify-between items-center relative px-3" >
                    <View>
                        <Text className="text-md font-medium mb-2 dark:text-slate-100"
                        >Lugar de finalización del viaje</Text>
                        <SearchInputAddress initialInput={truncatedTextDestination} isOrigin={false} placeholder='A dónde queres ir?' />
                    </View>
                    <View className="mt-7 absolute top-2 right-[-2]">
                        <TouchableOpacity onPress={() => setMode('selectingDestination')}>
                            <IconMarker />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }


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
                        <View>
                            {(indexSheet == 0 || indexSheet == 1) && (<SelectPoints />)}
                            {(indexSheet > 1 && (<FormTrip origin={destinationRef.current} destination={destinationRef.current} />))}
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </ScrollView>
    );
}