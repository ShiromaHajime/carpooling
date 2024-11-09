import { useToast } from "@/components/Toast";
import { Button } from "@/components/buttons/Button";
import { InputStyled } from "@/components/inputs/InputStyled";
import { GlobalContext } from "@/utils/Provider";
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DropDownCar } from "@/components/DropDownCar";
import Animated, { FadeIn } from "react-native-reanimated";
import { VehicleDB } from "@/types/types";
import { getVehiclesByUserID } from "@/services/vehicle";
import { Skeleton } from "@/components/Skeleton";
import { PlaceJsonv2 } from "@/types/addressNominatim";
import { createTrip } from "@/services/createTrip";

export default function FormTrip({ origin, destination }: { origin?: PlaceJsonv2, destination?: PlaceJsonv2 }) {
    const [available_seats, setTripSeat] = useState('');
    const [seat_price, setTripSeatPrice] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [myCars, setMycars] = useState<VehicleDB[]>([]);

    const router = useRouter();
    const context = useContext(GlobalContext)
    const idDriver = context.user.id
    const { toast } = useToast();
    const selectedIdCar = useRef<number>()
    const dateInputRef = useRef('')
    const timeInputRef = useRef('')

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (datetime: Date) => {
        const date = datetime.toLocaleDateString('en-CA')
        const time = datetime.toLocaleTimeString()
        dateInputRef.current = date
        timeInputRef.current = time
        hideDatePicker();
    };

    useEffect(() => {
        const getCars = async () => {
            const { errorHttp, vehicles } = await getVehiclesByUserID(idDriver)
            if (errorHttp || !vehicles) return toast('No tienes vehículos registrados, registra vehiculos en tu perfil', 'destructive', 5000, 'top', false)
            if (vehicles.length > 0) {
                console.log(vehicles);
                setMycars(vehicles)
            }
        }

        if (myCars.length == 0) {
            getCars()
        }
    }, [])

    const handleCreateTrip = async () => {

        toast('Registrando viaje', 'info', 2000, 'top')
        // console.log('values: ', 'origin', origin, 'destination', destination, 'dateInputRef', dateInputRef.current, 'timeInputRef', timeInputRef.current, 'selectedCarRef.current', selectedIdCar.current, 'available_seats', available_seats, 'seat_price', seat_price);
        if (!origin) return
        if (!destination) return
        if (!dateInputRef.current || !timeInputRef.current) return toast('No hay fecha seleccionada', 'destructive', 3500, 'top', false)
        if (!selectedIdCar.current) return toast('No hay vehículo seleccionado', 'destructive', 3500, 'top', false)
        if (!available_seats) return toast('Ingrese cantidad de asientos disponibles', 'destructive', 4200, 'top', false)
        if (!seat_price) return toast('Ingrese precio por asiento disponible', 'destructive', 4200, 'top', false)

        const { error, trip } = await createTrip({
            idDriver,
            idVehicle: selectedIdCar.current,
            origin, destination,
            departure_date: dateInputRef.current,
            departure_time: timeInputRef.current,
            available_seats: parseInt(available_seats),
            seat_price: parseFloat(seat_price)
        })

        if (error) {
            if (error.httpCode == 500) return toast(error.message, 'destructive', 4500, 'top', false)
            if (error.httpCode == 400) return toast(error.message, 'destructive', 4500, 'top', false)
            if (error.httpCode == 404) return toast(error.message, 'destructive', 4500, 'top', false)
            return toast('Hubo un error inesperado del servidor', 'destructive', 4500, 'top', false)
        }
        if (trip) {
            router.replace({ pathname: "/(home)" })
            return toast('Viaje creado exitosamente!', 'success', 3400, 'top', false)
        }
    }

    const setSelectedIdCar = (idCar: number) => {
        selectedIdCar.current = idCar
    }

    return (
        <ScrollView className="flex h-full px-5 py-2">
            <Animated.View entering={FadeIn.duration(200)} className="gap-5">
                <View className="mt-6" >
                    <Text className="text-md font-medium dark:text-slate-100 mb-2">Fecha y hora del viaje</Text>
                    <Button label="Seleccionar fecha y hora" onPress={showDatePicker} />
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="datetime"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                </View>

                <View>
                    <Text className="text-md font-medium dark:text-slate-100 mb-2">Vehículo</Text>
                    {myCars.length > 0 ? <DropDownCar options={myCars} handleSelected={setSelectedIdCar} /> : <Skeleton className="w-full h-11" />}
                </View>

                <View>
                    <Text className="text-md font-medium dark:text-slate-100 mb-2"
                    >Asientos disponibles</Text>
                    <InputStyled
                        setValueInput={setTripSeat}
                        placeholder="Ingrese la cantidad de pasajeros"
                    />
                </View>
                <View>
                    <Text className="text-md font-medium dark:text-slate-100 mb-2"
                    >Precio del viaje</Text>
                    <InputStyled
                        setValueInput={setTripSeatPrice}
                        placeholder="Ingrese el precio por pasajero"
                    />
                </View>

                <View className="py-10 flex-1">
                    <Button
                        className="flex-1"
                        label="Crear viaje"
                        onPress={handleCreateTrip}
                    />
                </View>
            </Animated.View>

        </ScrollView>
    )
}
