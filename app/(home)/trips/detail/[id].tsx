import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { useToast } from "@/components/Toast";
import { getTripById, joinTrip } from "@/services/trip";
import { User, TripById } from "@/types/types";
import { parseUrlParams } from "@/utils/utils";
import { Link, router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native"
import { CardDriver } from "./CardDriver";

export default function DetailTripScreen() {
    const { id } = useLocalSearchParams();
    const [trip, setTrip] = useState<TripById>()
    const [driver, setDriver] = useState<User>()

    const [loading, setLoading] = useState(true)
    const { toast } = useToast();


    useEffect(() => {
        if (!loading && !trip) {
            toast('Hubo un error al cargar el detalle del viaje', 'destructive', 2500, 'top', false);
            router.replace('/(home)/trips/tripList');
        }
    }, [loading, trip]);


    useEffect(() => {

        const getDetail = async (id: string) => {

            setLoading(true)

            console.log('fetch con id' + id + ' Por ahora solo funciona con id 1');
            const trip = await getTripById(id)
            console.log("trip getted");
            console.log(trip);

            if (trip) {
                setTrip(trip)
                setDriver(trip.driver)
            }
            setLoading(false)
        }

        if (!id) {
            router.push('/(home)/trips/tripList')
            return
        }
        let idParsed = parseUrlParams(id)
        getDetail(idParsed)
    }, [])


    const handleJoinTrip = async () => {
        console.log('join trip'); //falta hacer la request para unirse al viaje
        const { data, error } = await joinTrip(parseUrlParams(id), "1")
        if (error) {
            toast('Hubo un error en la conexion con el servidor', 'destructive', 2800, 'top', false);
            return
        }
        toast('Se ha unido al viaje! Puedes hablar con el conductor para coordinar el viaje', 'success', 4000, 'top', false);

    }


    if (loading) {
        return (
            <View>
                <Text>Cargando detalle del viaje...</Text>
            </View>
        )
    }

    if (!trip || !driver) return

    return (
        <ScrollView>
            <View>
                <Image source={require('@/assets/images/googleMapsExample.png')}
                    className="h-[230] object-cover"
                />
            </View>
            <View className="bg-gray-200 dark:bg-gray-900 flex items-start justify-start h-full pl-8 pr-8">

                <View className="mt-7 " >
                    <Text className="font-semibold dark:color-slate-200 ">Lugar de inicio de viaje</Text>
                    <Text className="text-[#64748B]">Ciudad: {trip.arrival_address.city.name}, calle {trip.arrival_address.street}</Text>
                </View>

                <View className="mt-3">
                    <Text className="font-semibold dark:color-slate-200">Lugar de finalizacion del viaje</Text>
                    <Text className="text-[#64748B]">Cuidad {trip.departure_address.city.name}, calle {trip.departure_address.street}</Text>
                </View>

                <View className="mt-3">
                    <Text className="font-semibold dark:color-slate-200">Fecha y hora de salida</Text>
                    <Text className="text-[#64748B]">Fecha: {trip.departure_date}</Text>
                    <Text className="text-[#64748B]">Hora: {trip.departure_time}</Text>
                </View>

                <View className="mt-3">
                    <Text className="font-semibold dark:color-slate-200">Asientos disponibles</Text>
                    <Text className="text-[#64748B]">{trip.available_seats}</Text>
                </View>

                <View className="mt-3">
                    <Text className="font-semibold dark:color-slate-200">Precio por asiento</Text>
                    <Text className="text-[#64748B]">{trip.seat_price} ARS</Text>
                </View>

                <View className="mt-8 w-full">
                    <CardDriver driver={driver} vehicle={trip.vehicle} />
                </View>

                <View className="self-center mt-8 mb-6">
                    <Button className="w-52" label="Unirse al viaje"
                        onPress={handleJoinTrip} />
                </View>
            </View>
        </ScrollView >
    )
}