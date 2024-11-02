import { Link } from "expo-router"
import { Text, View, Image, Alert } from "react-native"
import { ThemedText } from '@/components/ThemedText';
import { Button } from "@/components/buttons/Button";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { getTokenFromStorage, loginUser } from "@/services/userLogin";
import { GlobalContext, UserContext } from "@/utils/Provider";

export default function WelcomeScreen() {


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


    const context = useContext(GlobalContext);


    useEffect(() => {
        const handleAccessToken = async () => {
            const token = await getTokenFromStorage();
            if (token) {
                const { user } = await loginUser(token)
                if (user) {
                    handleShowModal(user)
                }
            }
        }
        handleAccessToken()
    }, [])

    const handleBlogin = () => {
        router.navigate("/(account)/login");
    }

    const handleBregistro = () => {
        router.navigate("/(account)/register");
    }

    return (
        <View className="bg-background h-full justify-center">

            <View className="flex-1 justify-center items-center">
                <Link href='/test' className="self-center">
                    <Text className="text-foreground text-5xl">¡Bienvenido a Carpooling!</Text>
                </Link>
                <Image source={require('@/assets/images/InitCar.png')} className="w-96 h-96 object-cover" />
                <View className="flex-row justify-evenly gap-8">
                    <Button label="Ingresar" className="w-28" onPress={handleBlogin}></Button>
                    <Button label="Registrarse" className="w-28" onPress={handleBregistro}></Button>
                </View>
            </View>





        </View>

    )
}