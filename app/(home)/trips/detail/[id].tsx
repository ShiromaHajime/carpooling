import { Button } from "@/components/buttons/Button";
import { Select } from "@/components/Select";
import { useToast } from "@/components/Toast";
import { getTripById, joinTrip, cancelTrip, cancelPetition } from "@/services/trip";
import { User, TripById } from "@/types/types";
import { parseUrlParams } from "@/utils/utils";
import { Link, router, useLocalSearchParams } from "expo-router"
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, ScrollView, Text, View } from "react-native"
import { CardDriver } from "./CardDriver";
import { GlobalContext } from "@/utils/Provider";
import { Skeleton } from "@/components/Skeleton";
import { LoadingScreen } from "./LoadingScreen";
import { CardPassenger } from "./CardPassenger";
import { decisionPetition } from "@/services/petitionPassenger";
import { getSolicitudesByID } from "@/services/getPetition"

export default function DetailTripScreen() {
    const { id } = useLocalSearchParams();
    const context = useContext(GlobalContext);
    const iduser = context?.user.id?.toString()
    const role = context?.role


    const [trip, setTrip] = useState<TripById>()
    const [driver, setDriver] = useState<User>()
    const [solicitudes, setSolicitudes] = useState()

    const [loading, setLoading] = useState(true)
    const { toast } = useToast();


    useEffect(() => {
        if (!loading && !trip) {
            toast('Hubo un error al cargar el detalle del viaje', 'destructive', 2500, 'top', false);
            router.replace('/(home)/trips/tripList');
        }
    }, [loading, trip]);

    useEffect(() => {
        const getSolicitudes = async () => {
            let solicitudes = await getSolicitudesByID(parseUrlParams(id) || ''); //?????????🦆🦆🦆🦆🦆?
            console.log("solicitudes", solicitudes);
            setSolicitudes(solicitudes)
        }
        getSolicitudes()
    }, []);


    useEffect(() => {
        const getDetail = async (id: string) => {
            setLoading(true)
            const trip = await getTripById(id)
            console.log("trip getted");
            if (trip) {
                setTrip(trip)
                setDriver(trip.vehicle_driver.driver.user)
                console.log(trip);
                console.log(trip?.id);
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
        if (!iduser) return
        toast('Postulandose al viaje', 'info', 2800, 'top')
        let trip_id = parseUrlParams(id)
        console.log('idPassenger', iduser, trip_id);
        const { data, error } = await joinTrip(iduser, trip_id)
        if (error) {
            console.log(error);
            toast('Hubo un error en la conexion con el servidor', 'destructive', 2800, 'top', false);
            return
        }
        toast('Se ha postulado al viaje! Puedes hablar con el conductor una vez este haya aceptado su candidatura', 'success', 4000, 'top', false);
    }
    const handlePressViewProfile = () => {
        router.replace({ pathname: "/(home)/(profile)/profile", params: { idDriver: driver?.id } })
    }

    const handleCancelPetition = async () => {
        if (!trip || !iduser) return

        const res = await cancelPetition(trip?.id, iduser)
        if (res) {
            toast('Se ha cancelado la solicitud', 'success', 4000, 'top', false);
            return
        }

    }

    const handleCancelTrip = async () => {
        if (!trip) return
        // toast('Cancelando el viaje', 'default', 2800, 'top')
        console.log("trip?.id, iduser");
        console.log(trip?.id, iduser);
        const res = await cancelTrip(trip.id, iduser)
        if (!res) toast('Hubo un error en la conexion con el servidor', 'destructive', 2800, 'top', false);
        toast('Se ha cancelado el viaje con exito', 'info', 4000, 'top', false);
    }

    if (loading) return (<LoadingScreen />)

    if (!trip || !driver) return

    const handlePetition = (desicion: boolean, id_user: number) => {
        decisionPetition(parseUrlParams(id), id_user, desicion)
    }

    const CardDriverPassanger = () => {

        if (role == 'Passenger') {
            return (
                <View>
                    <View className="mt-8 w-full">
                        <CardDriver driver={driver} vehicle={trip.vehicle_driver.vehicle} handlePressViewProfile={handlePressViewProfile} />
                    </View>

                    <View className="self-center mt-8 mb-6 gap-4">
                        <Button className="w-52" label="Unirse al viaje"
                            onPress={handleJoinTrip} />
                        <Button className="bg-destructive" label="Cancelar Solicitud"
                            onPress={handleCancelPetition} />
                    </View>
                </View>
            )
        }

        //la card me tendrua que llevar al User, pero ahora no hace
        if (role == 'Driver') {
            const cantsolicitudes = solicitudes.length
            return (
                <>
                    <View>
                        <Text className="font-semibold dark:color-slate-200">La cantidad de solicitudes es: {cantsolicitudes} </Text>
                    </View>
                    {/* solicitudes */}

                    <FlatList data={solicitudes}
                        renderItem={({ item }) => <CardPassenger key={item.id.toString()} passenger={item.passenger} isSimple={false} handleDecision={handlePetition} title='' />}
                        keyExtractor={item => item.id.toString()}
                    />

                    <View className="mt-6">
                        <Button className="flex-1 bg-red-600" label="Cancelar viaje"
                            onPress={handleCancelTrip} />
                    </View>
                </>
            )
        }

    }
    const departureAddress = trip.departure_address
    const arrivalAddress = trip.arrival_address
    const textDeparture = `${departureAddress.street}, ${departureAddress.number ? 'Número: ' + departureAddress.number + ', ' : ''} ${departureAddress.locality.name}${(departureAddress.locality.principal_subdivision ? ', ' + departureAddress.locality.principal_subdivision.name : '')}`
    const textArrival = `${arrivalAddress.street}, ${arrivalAddress.number ? 'Número: ' + arrivalAddress.number + ', ' : ''} ${arrivalAddress.locality.name}${(arrivalAddress.locality.principal_subdivision ? ', ' + arrivalAddress.locality.principal_subdivision.name : '')}`
    return (
        <ScrollView>
            <View>
                <Image source={require('@/assets/images/googleMapsExample.png')}
                    className="h-[230] object-cover"
                />
            </View>
            <View className="bg-background flex items-start justify-start h-full pl-8 pr-8">

                <View className="mt-7 " >
                    <Text className="font-semibold dark:color-slate-200 ">Lugar de inicio de viaje</Text>
                    <Text className="text-[#64748B]">{textDeparture}</Text>
                </View>
                <View className="mt-3">
                    <Text className="font-semibold dark:color-slate-200">Lugar de finalizacion del viaje</Text>
                    <Text className="text-[#64748B]">{textArrival}</Text>
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
                    <CardDriverPassanger />
                </View>

                <View className="flex flex-row justify-center items-center gap-4 mt-6 mb-6">
                    <Button className="flex-1" label="Chat"
                        onPress={() => router.push({ pathname: "/(home)/trips/detail/chat", params: { idTrip: trip.id } })} />
                </View>
            </View>
        </ScrollView >
    )
}