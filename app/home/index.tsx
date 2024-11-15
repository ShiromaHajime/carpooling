import { router, useFocusEffect } from "expo-router";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { Button } from "@/components/buttons/Button";
import { useCallback, useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/utils/Provider";
import { getHistoryTrips } from "@/services/trip";
import { Trips } from "@/types/types";


export default function HomeScreen() {
    const context = useContext(GlobalContext);
    const contextRole = context?.role
    const user = context?.user
    const [loading, setLoading] = useState(true);
    const [trips, setTrips] = useState<Trips>([]);

    useEffect(() => {
        const getTrips = async () => {
            const tripsData = await getHistoryTrips(user.id);
            setLoading(false);
            if (tripsData) {
                const tripsJson = JSON.stringify(tripsData);
                const tripsObj = JSON.parse(tripsJson);
                if (contextRole === 'Driver') {
                    setTrips(tripsObj.trips_as_driver);
                } else if (contextRole === 'Passenger') {
                    setTrips(tripsObj.trips_as_passenger);
                }
            }
        }
        setLoading(true);
        getTrips();
    }, [contextRole]);


    const handleButtonTrip = (role: String) => {
        if (role == 'Driver') {
            router.replace("/home/trips/createTrip")
            return
        }
        if (contextRole == 'Passenger') {
            router.replace("/home/trips/tripList") //ir a buscar viaje
            return
        }

    }
    const RequestPassengers = () => {

        return (
            <View>
            </View>
        )
    }

    const HistoryTrips = () => {
        if (loading) {
            return (
                <View className="bg-background flex items-center h-full pl-5 pr-5">
                    <ActivityIndicator size="large" />
                </View>
            );
        }
        return (
            <View>
                <FlatList
                    className="w-full"
                    data={trips}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => router.navigate(`/home/trips/detail/${item.id}`)} className="p-4 bg-card mb-6 w-full rounded-lg shadow-lg">
                            <Text className="text-foreground text-lg">
                                Desde: {item.departure_address.locality.principal_subdivision.name} - {item.departure_address.locality.name}
                            </Text>
                            <Text className="text-foreground text-lg">
                                Hasta: {item.arrival_address.locality.principal_subdivision.name} - {item.arrival_address.locality.name}
                            </Text>
                            <Text className="text-foreground text-bold text-lg">
                                Fecha de salida: <Text className="text-foreground text-lg text-bold">{item.departure_date}</Text>
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }
    return (
        <View className="bg-background flex items-center h-full p-5 py-7 pr-5">
            {(contextRole == 'Driver') && (<RequestPassengers />)}
            <Button label={`${contextRole == 'Driver' ? 'Crear nuevo viaje' : 'Buscar nuevo viaje'}`} onPress={() => handleButtonTrip(context.role)} className="px-28 py-2" />
            <Text className="text-foreground text-lg font-bold py-10">Historial de viajes</Text>
            <HistoryTrips />
        </View>
    );
}