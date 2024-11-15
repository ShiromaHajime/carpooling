import { FlatList, Text, TouchableOpacity, View } from "react-native"

import { MutableRefObject, useContext, useEffect, useState } from "react";

import { PlaceJsonv2 } from "@/types/addressNominatim";
import { InputAddress } from "@/components/inputs/InputAddress";
import { IconMarker } from "@/components/icons/Icons";
import { searchAddressNominatim } from "@/services/geoposition";
import { LatLng } from "react-native-maps";
import { TripContext } from "../TripProvider";

interface SearchInputAddressProps {
    initialInput: string;
    isOrigin: boolean;
    placeholder: string;
    setOrigin: (coord: LatLng | undefined) => void;
    setDestination: (coord: LatLng | undefined) => void;
    originRef: MutableRefObject<PlaceJsonv2 | undefined>;
    destinationRef: MutableRefObject<PlaceJsonv2 | undefined>;
}

export const SearchInputAddress = ({ initialInput, isOrigin, placeholder, setOrigin, setDestination, originRef, destinationRef }: SearchInputAddressProps) => {

    const [isFocus, setIsFocus] = useState(false);
    const [searchText, setSearchText] = useState(initialInput ?? '');
    const [debouncedText, setDebouncedText] = useState('');
    const [addressList, setAddressList] = useState<PlaceJsonv2[]>([]);
    const [addressSelected, setAddressSelected] = useState('');



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
                    <View className="bg-card p-2 flex flex-col gap-2 border border-border mt-2" >
                        <FlatList
                            data={addressList}
                            contentContainerStyle={{ gap: 4 }}
                            keyExtractor={(item) => item.osm_id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectAddress(item)} className="z-50, pt-1" key={item.osm_id}>
                                    <Text numberOfLines={2} className="text-foreground">{item.display_name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )
            }
        </View>

    )
}






interface PropSelectPoints {
    originLocation: PlaceJsonv2 | undefined,
    destinationLocation: PlaceJsonv2 | undefined,
    setOrigin: (cood: LatLng | undefined) => void,
    setDestination: (cood: LatLng | undefined) => void,
    originRef: MutableRefObject<PlaceJsonv2 | undefined>,
    destinationRef: MutableRefObject<PlaceJsonv2 | undefined>,
}

export const SelectPoints = ({ originLocation, destinationLocation, setOrigin, setDestination, destinationRef, originRef }: PropSelectPoints) => {

    const strOrigin = originLocation ? originLocation.display_name : ''
    const strDestination = destinationLocation ? destinationLocation.display_name : ''

    const [truncatedTextOrigin, setTruncatedTextOrigin] = useState(strOrigin.length > 35 ? strOrigin.substring(0, 40) + '...' : strOrigin);
    const [truncatedTextDestination, setTruncatedTextDestination] = useState(strDestination.length > 35 ? strDestination.substring(0, 40) + '...' : strDestination);

    useEffect(() => {
        const strOrigin = originLocation ? originLocation.display_name : ''
        setTruncatedTextOrigin(strOrigin.length > 35 ? strOrigin.substring(0, 40) + '...' : strOrigin)
    }, [originLocation])
    useEffect(() => {
        const strDestination = destinationLocation ? destinationLocation.display_name : ''
        setTruncatedTextDestination(strDestination.length > 35 ? strDestination.substring(0, 40) + '...' : strDestination)
    }, [destinationLocation])

    const context = useContext(TripContext);


    return (
        <View className="flex h-full px-1">
            <View className="mt-4 mb-6 flex-row justify-between items-center relative" >
                <View className="flex-1">
                    <Text className="text-md font-medium text-foreground mb-2">
                        Lugar de inicio del viaje
                    </Text>
                    <SearchInputAddress initialInput={truncatedTextOrigin} isOrigin={true} placeholder='Desde dónde queres viajar?' setOrigin={setOrigin} destinationRef={destinationRef} originRef={originRef} setDestination={setDestination} />
                </View>
                <View className="mt-7 absolute top-2 right-[-2]">
                    <TouchableOpacity onPress={() => {
                        if (context.selectingMode) {
                            context.setSelectingMode('selectingOrigin')
                        }
                    }}>
                        <IconMarker />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="mt-3 mb-6 flex-row justify-between items-center relative px-3" >
                <View>
                    <Text className="text-md font-medium mb-2 dark:text-slate-100"
                    >Lugar de finalización del viaje</Text>
                    <SearchInputAddress initialInput={truncatedTextDestination} isOrigin={false} placeholder='A dónde queres ir?' setDestination={setDestination} setOrigin={setOrigin} originRef={originRef} destinationRef={destinationRef} />
                </View>
                <View className="mt-7 absolute top-2 right-[-2]">
                    <TouchableOpacity onPress={() => {
                        if (context.selectingMode) {
                            context.setSelectingMode('selectingDestination')
                        }
                    }}>
                        <IconMarker />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
