import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";
import { Input } from "@/components/inputs/Input";
import { InputStyled } from "@/components/inputs/InputStyled";
import { UserAccount } from "@/types/types";
import { GlobalContext } from "@/utils/Provider";
import { Link, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Text, View } from "react-native";

export default function LoginScreen() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const context = useContext(GlobalContext);

  const { toast } = useToast()
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();  // Para redirección

  const handleShowModal = (user: UserAccount) => {
    // Mostrar modal de elección de conductor/pasajero y redirigir a la pantalla correspondiente
    Alert.alert(
      "Elige tu rol",
      "¿Eres conductor o pasajero?",
      [
        {
          text: "Conductor", onPress: () => {
            context?.setState(user)
            router.replace("/trips/create")

          }
        },  // Redirigir a crear viaje
        {
          text: "Pasajero", onPress: () => {
            context?.setState(user)
            router.replace("/trips/tripList")
          }
        },  // Redirigir a lista de viajes
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="bg-background flex h-screen pl-7 pr-7">

      <View className="self-center mt-8">
        <Avatar className="w-36 h-36">
          <AvatarImage
            className="w-36 h-36"
            source={{
              uri: 'https://png.pngtree.com/png-clipart/20230623/original/pngtree-an-illustration-of-dog-in-circle-shape-sky-png-image_9205321.png',
            }}
          />
          <AvatarFallback>CG</AvatarFallback>
        </Avatar>
      </View>

      <View className="mt-5">
        <Text className="text-md font-medium mb-2 dark:text-slate-100">Usuario</Text>
        <InputStyled
          setValueInput={setUsername}
          placeholder="Ingrese su nombre de usuario"
        />
      </View>

      <View className="mt-5 mb-5">
        <Text className="text-md font-medium mb-2 dark:text-slate-100">Contraseña</Text>
        <Input
          className="focus:border focus:border-slate-900 dark:focus:border-gray-400"
          secureTextEntry={true}
          value={password}
          onChange={(e) => setPassword(e.nativeEvent.text)}
          placeholder="Ingrese su contraseña"
        />
      </View>
      <View className="self-center  justify-center">
        <Button label="Registrar vehiculo"
          className="rounded bg-primary self-center  w-52 h-11"
          onPress={() => router.navigate({ pathname: "/(home)/(profile)/createVehicle" })} />
      </View>
    </View>
  );
}
