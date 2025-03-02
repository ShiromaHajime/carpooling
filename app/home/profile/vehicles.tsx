import { Card } from "@/components/Card";
import { useToast } from "@/components/Toast";
import { UserAccount, Vehicle } from "@/types/types";
import { GlobalContext } from "@/utils/Provider";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { CarList } from "./CarList";
import { Button } from "@/components/buttons/Button";
import { getVehiclesByUserID } from "@/services/vehicle";
import { parseUrlParams } from "@/utils/utils";

export default function VehiclesScreen() {

  const { idDriver } = useLocalSearchParams();
  const context = useContext(GlobalContext);
  const user = context?.user
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter();
  const navigation = useNavigation();  // Accede al objeto de navegación

  useEffect(() => {
    const getVehicles = async () => {
      const id = idDriver ? parseUrlParams(idDriver) : user.id
      setLoading(true)
      const { errorHttp, vehicles } = await getVehiclesByUserID(id)
      setLoading(false)

      if (errorHttp == 404) return
      if (errorHttp) {
        return toast('Error buscando vehiculos del conductor', 'destructive', 3500, 'top', false)
      }
      if (vehicles) {
        setVehicles(vehicles)
      }
    }
    if (idDriver) {
      navigation.setOptions({ title: 'Vehículos' });
    }
    getVehicles()
  }, [])

  return (
    <View className="bg-background flex-1 pl-7 pr-7 pt-5 pb-5">
      {(vehicles?.length > 0 && !loading) && (<CarList cars={vehicles} />)}
      {(vehicles?.length == 0 && !loading) && (<Text className="text-foreground font-medium text-lg self-center ">El conductor no tiene vehículos registrados</Text>)}
      {(loading) && ((<ActivityIndicator size='large' />))}

      <View className="mt-4" />
      {!idDriver && (
        <View className="self-center justify-center mt-4">
          <Button label="Registrar nuevo vehículo"
            className="rounded bg-primary self-center h-11"
            onPress={() => router.navigate("/home/profile/createVehicle")} />
        </View>
      )}

    </View>

  );
}
