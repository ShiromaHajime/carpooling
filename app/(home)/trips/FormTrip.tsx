import { useToast } from "@/components/Toast";
import { Button } from "@/components/buttons/Button";
import { InputStyled } from "@/components/inputs/InputStyled";
import { createTrip } from "@/services/createTrip";
import { GlobalContext } from "@/utils/Provider";
import { useRouter } from "expo-router";
import { ChevronUp, CircleUser, CreditCard, Settings } from "lucide-react-native";
import { useContext, useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LatLng } from "react-native-maps";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DropDownCar } from "../../../components/DropDownCar";
import Animated, { FadeIn } from "react-native-reanimated";
import { Entypo, EvilIcons } from "@expo/vector-icons";

export default function FormTrip({ origin, destination }: { origin?: LatLng, destination?: LatLng }) {
    const [available_seats, setTripSeat] = useState('');
    const [seat_price, setTripSeatPrice] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const router = useRouter();
    const context = useContext(GlobalContext)
    const idDriver = context?.user.id
    const [user, setUser] = useState(context?.user);
    const { toast } = useToast();
    const selectedCarRef = useRef('')
    const dateInputRef = useRef('')
    const timeInputRef = useRef('')

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (datetime: Date) => {
        const date = datetime.toLocaleDateString()
        const time = datetime.toLocaleTimeString()
        dateInputRef.current = date
        timeInputRef.current = time
        hideDatePicker();
    };

    const handleCreateTrip = async () => {

        toast('Registrando viaje', 'info', 2000, 'top')

        console.log('values: ');
        console.log("origin");
        console.log(origin);
        console.log("destination");
        console.log(destination);
        console.log("dateInputRef");
        console.log(dateInputRef.current);
        console.log("timeInputRef");
        console.log(timeInputRef.current);
        console.log("selectedCarRef.current")
        console.log(selectedCarRef.current);
        console.log("available_seats");
        console.log(available_seats);
        console.log("seat_price");
        console.log(seat_price);

        // const res = await createTrip({ idDriver, origin, destination, departure_date, departure_time, available_seats, seat_price, vehicle_driver })
        // if (res) {
        //     toast(res.message ?? 'Viaje creado exitosamente!', 'success', 3400, 'top', false)
        // } else {
        //     toast('Hubo un error al registrar el viaje', 'destructive', 3400, 'top', false)
        // }
    }

    const handleSelectCar = (car: string) => {
        selectedCarRef.current = car
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
                    <DropDownCar options={['Clio', 'Peugeot', 'Ferrari']} handleSelected={handleSelectCar} />
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
