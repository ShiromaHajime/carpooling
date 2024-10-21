import { Card } from "@/components/Card";
import { useToast } from "@/components/Toast";
import { UserAccount, Vehicle } from "@/types/types";
import { GlobalContext } from "@/utils/Provider";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Text, View } from "react-native";
import { CarList } from "./CarList";
import { Button } from "@/components/buttons/Button";

export default function VehiclesScreen() {

  const context = useContext(GlobalContext);
  const user = context?.user

  const { toast } = useToast()

  const router = useRouter();  // Para redirección
  const dummyCars: Vehicle[] = [
    {
      brand: "Toyota",
      license_plate: "ABC123",
      model: "Corolla",
      year: "2020",
      color: "Red",
    },
    {
      brand: "Honda",
      license_plate: "XYZ789",
      model: "Civic",
      year: "2019",
      color: "Blue",
    },
    {
      brand: "Ford",
      license_plate: "LMN456",
      model: "Focus",
      year: "2021",
      // color está ausente, es opcional
    },
    {
      brand: "Chevrolet",
      license_plate: "QRS321",
      model: "Malibu",
      year: "2018",
      color: "Black",
    },
    {
      brand: "Nissan",
      license_plate: "TUV654",
      model: "Altima",
      year: "2022",
      color: "White",
    },
  ]

  return (
    <View className="bg-background flex-1 pl-7 pr-7 pt-5 pb-5">
      <CarList cars={dummyCars} />
      <View className="mt-4" />
      <View className="self-center justify-center mt-4">
        <Button label="Registrar nuevo vehículo"
          className="rounded bg-primary self-center h-11"
          onPress={() => router.navigate({ pathname: "/(home)/(profile)/createVehicle" })} />
      </View>
    </View>

  );
}
