import { Link, useRouter } from "expo-router";
import { Text, View, Alert } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Input } from "@/components/inputs/Input";
import { InputStyled } from "@/components/inputs/InputStyled";
import { useState } from "react";
import { loginUser } from "@/services/userLogin";

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {

    const res = await loginUser(username, password);//saque corchetes porque tiraba error

    if (res) {
      // se tiene que ejecutar el handleShowModal
    }

    if (!username || !password) {
      console.log('Error, Por favor, ingrese el username y password.'); //ARREGLAR PARA MENSAJE
      return;
    }
  }
  const router = useRouter();  // Para redirección

  const handleShowModal = () => {
    // Mostrar modal de elección de conductor/pasajero y redirigir a la pantalla correspondiente
    Alert.alert(
      "Elige tu rol",
      "¿Eres conductor o pasajero?",
      [
        { text: "Conductor", onPress: () => router.push("/trips/create") },  // Redirigir a crear viaje
        { text: "Pasajero", onPress: () => router.push("/trips/tripList") },  // Redirigir a lista de viajes
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="bg-gray-200 flex h-screen pl-7 pr-7 dark:bg-gray-900">

      <View className="self-center mt-8">
        <Avatar className="w-36 h-36">
          <AvatarImage
            className="w-36 h-36"
            source={require('../../assets/images/userlogoblack.png')}
          />
          <AvatarFallback>CG</AvatarFallback>
        </Avatar>
      </View>

      <View className="mt-5">
        <Text className="text-md font-medium mb-2 dark:text-slate-100">Username</Text>
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
      <Button className="w-52 bg-[#104736]" label = "Iniciar sesión"
onPress = { handleLogin } />
        <Button className="w-52 bg-[#104736]" label="Iniciar sesión" onPress={handleShowModal} />
      </View>

      <View className="bg-slate-400 flex items-center justify-center h-20 pl-5 pr-5">
        <Text className="text-gray-200">Login</Text>
        <Link href='/(account)/register'>No tienes cuenta? Registrarse</Link>
      </View>

    </View>
  );
}
