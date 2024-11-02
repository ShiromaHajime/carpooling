import { Link, useRouter } from "expo-router";
import { Text, View, Alert } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/buttons/Button";
import { Input } from "@/components/inputs/Input";
import { InputStyled } from "@/components/inputs/InputStyled";
import { useContext, useState } from "react";
import { loginUser, loginWithGoogle, signInUserWithEmailAndPassword } from "@/services/userLogin";
import { GlobalContext, UserContext } from "@/utils/Provider";
import { useToast } from "@/components/Toast";
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { GOOGLE_CLIENT_ID } from "@/constants/const";
import { msgEmailNotVerified, msgError500 } from "@/constants/texts";

export default function LoginScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const context = useContext(GlobalContext);
  GoogleSignin.configure({ webClientId: GOOGLE_CLIENT_ID, });
  const router = useRouter();  // Para redirección

  const { toast } = useToast()
  const [errors, setErrors] = useState<Record<string, string>>({});


  const handleLogin = async () => {
    setLoading(true)
    const { error, userCredential } = await signInUserWithEmailAndPassword(email, password)
    if (error || !userCredential) return toast('Hubo un error al iniciar sesión', 'destructive', 2500, 'top', false)
    const userC = userCredential.user
    if (!userC.emailVerified) return toast(msgEmailNotVerified, 'info', 4500, 'top', false)

    const token = await userCredential.user.getIdToken()
    const { errorHttp, user } = await loginUser(token)
    if (errorHttp) {
      if (errorHttp == 401) return toast('El token es inválido, intentelo de nuevo mas tarde', 'destructive', 3000, 'top', false)
      if (errorHttp == 403) return toast(msgEmailNotVerified, 'info', 3000, 'top', false)
      if (errorHttp == 404) return toast('El usuario no está registrado', 'destructive', 3000, 'top', false)
      if (errorHttp == 500) return toast(msgError500, 'destructive', 3000, 'top', false)
    }
    if (!user) return toast(msgError500, 'destructive', 3000, 'top', false)
    setLoading(false)
    handleShowModal(user)
  }


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



  const handleLoginGoogle = async () => {
    setLoading(true)
    const { error, userGoogle } = await loginWithGoogle()
    if (error || !userGoogle?.idToken) return toast(msgError500, 'destructive', 3000, 'top', false)

    const { errorHttp, user } = await loginUser(userGoogle.idToken)
    if (errorHttp) {
      if (errorHttp == 401) return toast('El token es inválido, intentelo de nuevo mas tarde', 'destructive', 3000, 'top', false)
      if (errorHttp == 404) return toast('El usuario no está registrado', 'destructive', 3000, 'top', false)
      if (errorHttp == 500) return toast(msgError500, 'destructive', 3000, 'top', false)
    }
    if (!user) return toast(msgError500, 'destructive', 3000, 'top', false)
    setLoading(false)
    handleShowModal(user)
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
