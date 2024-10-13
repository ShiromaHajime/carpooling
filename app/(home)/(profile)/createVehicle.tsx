import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar"
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";
import { Input } from "@/components/inputs/Input";
import { InputStyled } from "@/components/inputs/InputStyled";
import { createUser } from "@/services/user";
import { createVehicle } from "@/services/vehicle";
import { Vehicle, schemaFormUser, schemaFormVehicle } from "@/types/types";
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

  const context = useContext(GlobalContext);
  const idDriver = context?.user.id
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
      toast('Enviando datos...', 'info', 1200, 'top')
      if (!idDriver) return
      const res = await createVehicle({ license_plate, brand, model, year, color, idDriver })
      // if (res) {
      //   toast('Usuario creado exitosamente!', 'success', 2300, 'top', false)
      //   router.replace('/login')
      // } else {
      //   toast('Hubo un error al registrar al usuario', 'destructive', 2500, 'top', false)
      // }

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