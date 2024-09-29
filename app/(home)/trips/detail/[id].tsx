import { Select } from "@/components/Select";
import { Trip } from "@/types/types";
import { Link, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react";
import { Text, View } from "react-native"

const dummyTrip: Trip =
{
    id: "1",
    departureDate: "2024-09-30T00:00:00Z",
    departureTime: "14:30",
    availableSeats: 20,
    seatPrice: 50.0,
    creationTimestamp: "2024-09-01T10:00:00Z",
    departureAddressId: "addr123",
    arrivalAddressId: "addr456",
    vehicleDriverId: "driver789"
}

export default function DetailTripScreen() {
    const { id } = useLocalSearchParams();

    const [trip, setTrip] = useState<Trip>()
    const [loading, setLoading] = useState(false)

    const [value, setValue] = useState('')

    useEffect(() => {
        const getDetail = () => {

            setTimeout(() => {
                console.log('algo');
                setTrip(dummyTrip)
                setLoading(false)
            }, 1500);
        }
        setLoading(true)
        getDetail()
    }, [])




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
        <View className="bg-slate-400 flex items-center justify-center h-screen pl-5 pr-5">
            <Text className="text-gray-200">Detalle Viaje</Text>

            <Text>id recibida de local params id: {id}</Text>

            <Text>Un viaje</Text>
            <Text>con id: {dummyTrip.id}</Text>
            <Text>con arrivalAddressId: {dummyTrip.arrivalAddressId}</Text>
            <Text>con availableSeats: {dummyTrip.availableSeats}</Text>
            <Text>con creationTimestamp: {dummyTrip.creationTimestamp}</Text>
            <Text>con departureAddressId: {dummyTrip.departureAddressId}</Text>
            <Text>con departureDate: {dummyTrip.departureDate}</Text>
            <Text>con departureTime: {dummyTrip.departureTime}</Text>
            <Text>con seatPrice: {dummyTrip.seatPrice}</Text>
            <Text>con vehicleDriverId: {dummyTrip.vehicleDriverId}</Text>
        </View>
    )
}