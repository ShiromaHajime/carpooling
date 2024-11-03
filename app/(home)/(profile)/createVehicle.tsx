import { Button } from "@/components/buttons/Button";
import { useToast } from "@/components/Toast";
import { InputStyled } from "@/components/inputs/InputStyled";
import { createVehicle } from "@/services/vehicle";
import { schemaFormVehicle } from "@/types/types";
import { GlobalContext } from "@/utils/Provider";
import { parseErrors } from "@/utils/utils";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { ScrollView, Text, View } from "react-native"

export default function CreateVehicleScreen() {

  const [license_plate, setLicense_plate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const context = useContext(GlobalContext)


  const { toast } = useToast();

  const handleRegister = async () => {
    console.log('handle register');
    const result = schemaFormVehicle.safeParse({ license_plate, brand, model, year, color });

    if (!result.success) {
      const newErrors = parseErrors(result)

      setErrors(newErrors);
    } else {
      // Datos válidos
      console.log('datos correctos:');
      setErrors({})
      console.log(result.data);
      toast('Registrando vehículo...', 'info', 1500, 'top')

      if (!context?.user.id) return
      const { errorHttp, vehicle } = await createVehicle({ license_plate, brand, model, year, color, user_id: context?.user.id })
      if (errorHttp) {
        if (errorHttp == 400) return toast('Faltan campos del vehículo', 'destructive', 3500, 'top', false)
        if (errorHttp == 409) return toast(`La patente ${license_plate}, ya esta registrada`, 'destructive', 3500, 'top', false)
        if (errorHttp == 500) return toast('Hubo un error del servidor', 'destructive', 3500, 'top', false)
      }
      if (vehicle) {
        toast('Vehiculo creado exitosamente!', 'success', 3000, 'top', false)
        router.replace('/(home)/(profile)/vehicles')
        return
      }
      return toast('Hubo un error del servidor', 'destructive', 3500, 'top', false)

    }

  }

  return (
    <ScrollView className="bg-background">
      <View className="flex h-max p-7 ">

        <View className="mt-5">
          <Text className="text-md font-medium mb-2 text-foreground"
          >Patente</Text>
          <InputStyled
            setValueInput={setLicense_plate}
            placeholder="Ingrese patente del vehículo"
          />
          {errors.license_plate && <Text style={{ color: 'red' }}>{errors.license_plate}</Text>}
        </View>

        <View className="mt-2">
          <Text className="text-md font-medium mb-2 text-foreground">
            Marca
          </Text>
          <InputStyled
            className=""
            setValueInput={setBrand}
            placeholder="Ingrese marca del vehículo"
          />
          {errors.brand && <Text style={{ color: 'red' }}>{errors.brand}</Text>}
        </View>


        <View className="mt-5">
          <Text className="text-md font-medium mb-2 text-foreground"
          >Modelo</Text>
          <InputStyled
            setValueInput={setModel}
            placeholder="Ingrese modelo del vehículo"
          />
          {errors.model && <Text style={{ color: 'red' }}>{errors.model}</Text>}
        </View>

        <View className="mt-5">
          <Text className="text-md font-medium mb-2 text-foreground"
          >Año</Text>
          <InputStyled
            setValueInput={setYear}
            placeholder="Ingrese año del vehículo"
          />
          {errors.year && <Text style={{ color: 'red' }}>{errors.year}</Text>}
        </View>



        <View className="mt-5">
          <Text className="text-md font-medium mb-2 text-foreground"
          >Color</Text>
          <InputStyled
            setValueInput={setColor}
            placeholder="Ingrese color del vehículo"
          />
          {errors.color && <Text style={{ color: 'red' }}>{errors.color}</Text>}
        </View>


        <View className="items-center mt-7 mb-5">
          <Button className="w-52 bg-primary" label="Registrar Vehículo"
            onPress={handleRegister} />
        </View>
      </View>

    </ScrollView >
  )
}