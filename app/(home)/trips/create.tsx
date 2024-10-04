import { ScrollView, Text, View } from "react-native"
import { Button } from "@/components/Button";
import { useRouter } from "expo-router";
import { GlobalContext } from "@/utils/Provider";
import { useContext, useState } from "react";
import { InputStyled } from "@/components/inputs/InputStyled";
import { createTrip } from "@/services/createTrip";
import { useToast } from "@/components/Toast";


export default function CreateTripScreen() {
    const router = useRouter();
    const context = useContext(GlobalContext)
    const idDriver = context?.state.id
    const [user, setUser] = useState(context?.state);
    const [deaparture_address, setTripDepaAddress] = useState('');
    const [arrival_address, setTripArrivAddress] = useState('');
    const [departure_date, setTripDate] = useState('');
    const [departure_time, setTripTime] = useState('');
    const [available_seats, setTripSeat] = useState('');
    const [seat_price, setTripSeatPrice] = useState('');
    const [vehicle_driver, setVehicle] = useState('');
    const { toast } = useToast();

    const handleBackToHome = () => {
        router.push("/(home)/home");
    };

    /*const voptions= [0,4,10]
    //[Tripc.vehicle_driver_id]
    <Select
                  label="Choose an option"
                  options={voptions}
  
                  onSelect={setSelectedValue}
                  selectedValue={selectedValue}
                  labelKey="description"
                  valueKey="code"
                  />
      */
    const handleCreateTrip = async () => {
        toast('Registrando viaje', 'info', 2000, 'top')
        const res = await createTrip({ idDriver, deaparture_address, arrival_address, departure_date, departure_time, available_seats, seat_price, vehicle_driver })
        if (res) {
            toast(res.message ?? 'Viaje creado exitosamente!', 'success', 3400, 'top', false)
        } else {
            toast('Hubo un error al registrar el viaje', 'destructive', 3400, 'top', false)

        }

    }

    <Text className="dark: text-slate-100">ID Del usuario con sesion iniciada: {user?.id}</Text>
    return (
        <ScrollView>
            <View className="bg-gray-200 flex h-full pl-5 pr-5 dark:bg-gray-900">

                <Text className="text-2xl font-bold mb-5 text-slate-800 dark:text-slate-100">
                    ¡Crea un viaje!
                </Text>

                <View className="mt-2 mb-6" >
                    <Text className="text-md font-medium mb-2 dark:text-slate-100"
                    >Lugar de inicio del viaje</Text>
                    <InputStyled
                        className=""
                        setValueInput={setTripDepaAddress}
                        placeholder="Provincia,ciudad,calle,número."
                    />
                </View>

                <View className="mt-2 mb-6" >
                    <Text className="text-md font-medium mb-2 dark:text-slate-100"
                    >Lugar de finalización del viaje</Text>
                    <InputStyled
                        className=""
                        setValueInput={setTripArrivAddress}
                        placeholder="Provincia,ciudad,calle,número."
                    />
                </View>

                <View className="mt-2 mb-6" >
                    <Text className="text-md font-medium mb-2 dark:text-slate-100"
                    >Fecha de inicio del viaje</Text>
                    <InputStyled
                        className=""
                        setValueInput={setTripDate}
                        placeholder="DD-MM-AAAA"
                    />
                </View>

                <View className="mt-2 mb-6">
                    <Text className="text-md font-medium mb-2 dark:text-slate-100"
                    >Hora de partida</Text>
                    <InputStyled
                        className=""
                        setValueInput={setTripTime}
                        placeholder="HH:MM"
                    />
                </View>

                <View className="mt-2 mb-6">
                    <Text className="text-md font-medium mb-2 dark:text-slate-100"
                    >Asientos disponibles</Text>
                    <InputStyled
                        className=""
                        setValueInput={setTripSeat}
                        placeholder="Ingrese la cantidad de pasajeros"
                    />
                </View>

                <View className="mt-2 mb-6">
                    <Text className="text-md font-medium mb-2 dark:text-slate-100"
                    >Precio por asiento</Text>
                    <InputStyled
                        className=""
                        setValueInput={setTripSeatPrice}
                        placeholder="Ingrese la cantidad de pasajeros"
                    />
                </View>

                <View className="mt-2 mb-15">
                    <Text className="text-md font-medium mb-2 dark:text-slate-100"
                    >Auto con el que va a realizar el viaje</Text>
                    <InputStyled
                        className=""
                        setValueInput={setVehicle}
                        placeholder="Ingrese el modelo del auto"
                    />
                </View>

                <View className="pt-10 flex-row justify-between pb-10">
                    <Button
                        className="w-40"
                        label="Volver al inicio"
                        onPress={handleBackToHome}
                    />
                    <Button
                        className="w-40"
                        label="Crear viaje"
                        onPress={handleCreateTrip}
                    />
                </View>


            </View>
        </ScrollView>
    );
}

//<Text className="dark: text-slate-100">ID Del usuario con sesion iniciada: {user?.id}</Text>