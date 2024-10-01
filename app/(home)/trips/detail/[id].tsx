import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { Trip } from "@/types/types";
import { Link, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native"

const dummyTrip: Trip =
{
    id: "1",
    departureDate: "2024-09-30T00:00:00Z",
    departureTime: "14:30",
    availableSeats: 20,
    seatPrice: 30.0,
    creationTimestamp: "2024-09-01T10:00:00Z",
    departureAddressId: "addr123",
    arrivalAddressId: "addr436",
    vehicleDriverId: "driver789"
}

export default function DetailTripScreen() {
    const { id } = useLocalSearchParams();

    const [trip, setTrip] = useState<Trip>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getDetail = () => {

            setTimeout(() => { //despues service que le pega al back para conseguir detalle del viaje por id
                setTrip(dummyTrip)
                setLoading(false)
            }, 300);
        }
        setLoading(true)
        getDetail()
    }, [])


    const handleJoinTrip = () => {
        console.log('join trip');

    }


    if (loading) {
        return (
            <View>
                <Text>Cargando detalle del viaje...</Text>
            </View>
        )
    }

    if (!loading && !trip) {
        return (
            <View>
                <Text>Hubo un error cargando el viaje</Text>
            </View>
        )
    }
    return (
        <ScrollView>

            <View className="bg-gray-200 dark:bg-gray-900 flex items-center justify-start h-full pl-3 pr-3">
                <Image source={require('@/assets/images/googleMapsExample.png')}
                    className="h-[230] object-cover"
                />
                <View className="mt-7" />
                <Text className="dark:color-slate-200">id recibida de local params id: {id}</Text>

                <Text className="text-2xl dark:color-slate-200">Un viaje con id: {dummyTrip.id} creado el: {dummyTrip.creationTimestamp}</Text>
                <View className="mt-2">
                    <Text className="font-semibold dark:color-slate-200">Lugar de inicio de viaje</Text>
                    <Text className="text-[#64748B]">{dummyTrip.arrivalAddressId}</Text>

                    <View className="mt-3">
                        <Text className="font-semibold dark:color-slate-200">Lugar de finalizacion del viaje</Text>
                        <Text className="text-[#64748B]">con departureAddressId: {dummyTrip.departureAddressId}</Text>
                    </View>

                    <View className="mt-3">
                        <Text className="font-semibold dark:color-slate-200">Fecha y hora de salida</Text>
                        <Text className="text-[#64748B]">con departureDate: {dummyTrip.departureDate}</Text>
                        <Text className="text-[#64748B]">con departureTime: {dummyTrip.departureTime}</Text>
                    </View>

                    <View className="mt-3">
                        <Text className="font-semibold dark:color-slate-200">Asientos disponibles</Text>
                        <Text className="text-[#64748B]">con availableSeats: {dummyTrip.availableSeats}</Text>
                    </View>

                    <View className="mt-3">
                        <Text className="font-semibold dark:color-slate-200">Precio por asiento</Text>
                        <Text className="text-[#64748B]">con seatPrice: {dummyTrip.seatPrice}</Text>
                    </View>

                    <View className="mt-3">
                        <Text className="font-semibold dark:color-slate-200">Conductor</Text>
                        <Text className="text-[#64748B]">con vehicleDriverId: {dummyTrip.vehicleDriverId}</Text>
                    </View>

                    <View className="items-center mt-8 mb-6">
                        <Button className="w-52" label="Unirse al viaje"
                            onPress={handleJoinTrip} />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}