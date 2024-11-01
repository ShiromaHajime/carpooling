import { Link, useRouter } from "expo-router";
import { Text, View, Alert } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/inputs/Input";
import { InputStyled } from "@/components/inputs/InputStyled";
import { useContext, useState } from "react";
import { loginUser, loginWithGoogle } from "@/services/userLogin";
import { GlobalContext, UserContext } from "@/utils/Provider";
import { UserAccount } from "@/types/types";
import { useToast } from "@/components/Toast";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID, auth } from "@/constants/const";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const context = useContext(GlobalContext);
  GoogleSignin.configure({ webClientId: GOOGLE_CLIENT_ID, });


  const { toast } = useToast()
  const [errors, setErrors] = useState<Record<string, string>>({});


  const handleLogin = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user.uid);
        user.getIdTokenResult()
        const token = await user.getIdToken()
        const token2 = await user.getIdTokenResult()

        console.log("tokenFirebase");
        console.log(token);
        console.log("token2");
        console.log(token2);
        // ...
      })
      .catch((error) => {

        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);

        // ..
      });
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
            router.replace("/trips/tripList")
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



  const handleLoginGoogle = () => {
    loginWithGoogle()
  }


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
        <Text className="text-md font-medium mb-2 dark:text-slate-100">Correo electrónico</Text>
        <InputStyled
          setValueInput={setEmail}
          placeholder="Ingrese su email"
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

      <View className="items-center mt-3 mb-7">
        <Button className="w-52 h-11 bg-primary" label="Iniciar sesión"
          onPress={handleLogin} />
      </View>

      <Text className="text-md font-medium mb-2 dark:text-slate-100 mt-2 self-center">O Inicia sesión con Google</Text>

      <View className="self-center mb-2">
        <GoogleSigninButton
          onPress={handleLoginGoogle} />
      </View>

      <View className="flex-row items-center justify-center pt-5 pb-6 pl-5 pr-5 rounded">
        <Link href='/(account)/register'><Text className="text-foreground">No tienes cuenta? </Text></Link>
        <Link href='/(account)/register' className="font-medium text-foreground">Registrate!</Link>
      </View>

    </View>
  );
}
