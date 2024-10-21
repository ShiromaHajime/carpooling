import { Link, useRouter } from "expo-router";
import { Text, View, Alert } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/inputs/Input";
import { InputStyled } from "@/components/inputs/InputStyled";
import { useContext, useState } from "react";
import { loginUser } from "@/services/userLogin";
import { GlobalContext, UserContext } from "@/utils/Provider";
import { UserAccount } from "@/types/types";
import { useToast } from "@/components/Toast";

export default function LoginScreen() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const context = useContext(GlobalContext);

  const { toast } = useToast()
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async () => {

    const res = await loginUser(username, password);

    if (res) {
      const user = res.user
      const userParsed: UserContext = {
        id: user.id,
        email: user.email,
        lastname: user.last_name,
        name: user.first_name,
        username: user.username,
      }

      handleShowModal(userParsed);
    } else toast('Usuario y/o contraseña incorrecta', 'destructive', 3000);

    if (!username || !password) {
      toast('Por favor, ingrese usuario y contraseña.', "destructive", 3000); //ARREGLAR PARA MENSAJE
      return;
    }
  }
  const router = useRouter();  // Para redirección

  const handleShowModal = (user: UserContext) => {
    // Mostrar modal de elección de conductor/pasajero y redirigir a la pantalla correspondiente
    Alert.alert(
      "Elige tu rol",
      "¿Eres conductor o pasajero?",
      [
        {
          text: "Conductor", onPress: () => {
            context?.setUser(user)
            context?.setRole('Driver')
            router.replace("/trips/create")
          }
        },  // Redirigir a crear viaje
        {
          text: "Pasajero", onPress: () => {
            context?.setUser(user)
            context?.setRole('Passenger')
            router.replace("/trips/tripList")
          }
        },  // Redirigir a lista de viajes
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="bg-gray-200 flex h-screen pl-7 pr-7 dark:bg-gray-900">

      <View className="self-center mt-8">
        <Avatar className="w-40 h-40">
          <AvatarImage
            className="w-40 h-40"
            source={require('../../assets/images/CarKeys.png')}
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

      <View className="items-center mt-7 mb-7">
        <Button className="w-52 h-11 bg-[#104736]" label="Iniciar sesión"
          onPress={handleLogin} />
      </View>

      <View className="bg-slate-400 flex-row items-center justify-center pt-5 pb-6 pl-5 pr-5 rounded">
        <Text>No tienes cuenta? </Text>
        <Link href='/(account)/register'>registrate!</Link>
      </View>

    </View>
  );
}
