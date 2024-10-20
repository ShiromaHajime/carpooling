import { DropDown, DropDownContent, DropDownItem, DropDownItemSeparator, DropDownLabel, DropDownTrigger } from "@/components/DropDown";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/buttons/Button";
import { InputStyled } from "@/components/inputs/InputStyled";
import { createTrip } from "@/services/createTrip";
import { GlobalContext } from "@/utils/Provider";
import { useRouter } from "expo-router";
import { CircleUser, CreditCard, Settings } from "lucide-react-native";
import { useContext, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LatLng } from "react-native-maps";

export default function FormTrip({ origin, destination }: { origin: LatLng, destination: LatLng }) {
    const [deaparture_address, setTripDepaAddress] = useState('');
    const [arrival_address, setTripArrivAddress] = useState('');
    const [departure_date, setTripDate] = useState('');
    const [departure_time, setTripTime] = useState('');
    const [available_seats, setTripSeat] = useState('');
    const [seat_price, setTripSeatPrice] = useState('');
    const [vehicle_driver, setVehicle] = useState('');

    const router = useRouter();
    const context = useContext(GlobalContext)
    const idDriver = context?.user.id
    const [user, setUser] = useState(context?.user);
    const { toast } = useToast();




    const handleBackToHome = () => {
        router.push("/(home)/home");
    };

    const handleCreateTrip = async () => {
        toast('Registrando viaje', 'info', 2000, 'top')
        const res = await createTrip({ idDriver, deaparture_address, arrival_address, departure_date, departure_time, available_seats, seat_price, vehicle_driver })
        if (res) {
            toast(res.message ?? 'Viaje creado exitosamente!', 'success', 3400, 'top', false)
        } else {
            toast('Hubo un error al registrar el viaje', 'destructive', 3400, 'top', false)

        }

    }


    return (
        <ScrollView className="flex h-full px-5 py-2">
            <View className="mt-2 mb-6" >
                <Text className="text-md font-medium mb-2 dark:text-slate-100"
                >Fecha de inicio del viaje</Text>
                <InputStyled
                    className="bg-slate-50"
                    setValueInput={setTripDate}
                    placeholder="DD-MM-AAAA"
                />
            </View>

            <View className="mt-2 mb-6">
                <Text className="text-md font-medium mb-2 dark:text-slate-100"
                >Hora de partida</Text>
                <InputStyled
                    className="bg-slate-50"
                    setValueInput={setTripTime}
                    placeholder="HH:MM"
                />
            </View>


            <View className="mt-2 mb-6">
                <Text className="text-md font-medium mb-2 dark:text-slate-100"
                >Asientos disponibles</Text>
                <InputStyled
                    className="bg-slate-50"
                    setValueInput={setTripSeat}
                    placeholder="Ingrese la cantidad de pasajeros"
                />
            </View>
            <View className="rounded-xl border border-border p-4 z-50">
                <DropDown>
                    <DropDownTrigger>
                        <Button label="Open Dropdown" />
                    </DropDownTrigger>
                    <DropDownContent>
                        <DropDownLabel labelTitle="My Account" />
                        <DropDownItemSeparator />
                        <DropDownItem>
                            <TouchableOpacity className="flex flex-row gap-2 items-center">
                                <CircleUser size={18} color='#000' />
                                <Text className="text-primary text-xl">Profile</Text>
                            </TouchableOpacity>
                        </DropDownItem>
                        <DropDownItem>
                            <TouchableOpacity className="flex flex-row gap-2 items-center">
                                <Settings size={18} color="#000" />
                                <Text className="text-primary text-xl">Settings</Text>
                            </TouchableOpacity>
                        </DropDownItem>
                        <DropDownItem>
                            <TouchableOpacity className="flex flex-row gap-2 items-center">
                                <CreditCard size={18} color='#000' />
                                <Text className="text-primary text-xl">Billing</Text>
                            </TouchableOpacity>
                        </DropDownItem>
                        <DropDownLabel labelTitle="Team" />
                        <DropDownItemSeparator />
                        <DropDownItem>
                            <TouchableOpacity className="flex flex-row gap-2 items-center">
                                <CreditCard size={18} color="#000" />
                                <Text className="text-primary text-xl">Billing</Text>
                            </TouchableOpacity>
                        </DropDownItem>
                    </DropDownContent>
                </DropDown>
            </View>
            <View className="mt-2 mb-15">
                <Text className="text-md font-medium mb-2 dark:text-slate-100"
                >Auto con el que va a realizar el viaje</Text>
                <InputStyled
                    className="bg-slate-50"
                    setValueInput={setVehicle}
                    placeholder="Ingrese el modelo del auto"
                />
            </View>

            <View className="mt-2 mb-6">
                <Text className="text-md font-medium mb-2 dark:text-slate-100"
                >Precio por asiento</Text>
                <InputStyled
                    className="bg-slate-50"
                    setValueInput={setTripSeatPrice}
                    placeholder="Ingrese el precio por asiento"
                />
            </View>



            <View className="pt-10 flex-row justify-between pb-10">
                <Button
                    className="w-40"
                    label="Crear viaje"
                    onPress={handleCreateTrip}
                />
            </View>
        </ScrollView>
    )
}
