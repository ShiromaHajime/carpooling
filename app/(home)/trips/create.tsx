import { View, Text } from "react-native";
import { Button } from "@/components/Button";
import { useRouter } from "expo-router";
import { useState } from "react";
import { InputStyled } from "@/components/inputs/InputStyled";
import { Tripc } from "@/types/types";
import {  } from "@/components/Select";

export default function CreateTripScreen() {
  const router = useRouter();
  const [TripDate, setTripDate] = useState('');

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

  return (
    <View className="bg-gray-200 flex items-center justify-center h-screen pl-5 pr-5 dark:bg-gray-900">
      <Text className="text-2xl font-bold mb-5 text-slate-800 dark:text-slate-100">
        Pantalla de crear viaje
      </Text>

      <View className="mt-2">
            <Text className="text-md font-medium mb-2 dark:text-slate-100"
            >Hora de partida</Text>
            <InputStyled
                className=""
                setValueInput={setTripDate}
                placeholder="Ingrese la hora de salida del viaje"
             />
      </View>


      <View className="mt-2">
            <Text className="text-md font-medium mb-2 dark:text-slate-100"
            >Vehiculo con el que viajas</Text>
      </View>

      <Text className="text-lg mb-5 text-slate-600 dark:text-slate-300">
        Aquí podrás crear un nuevo viaje.
      </Text>

      <Button
        className="w-40"
        label="Volver al inicio"
        onPress={handleBackToHome}
      />
    </View>
  );
}
