import { Link } from "expo-router"
import { Text, View, Image, Alert } from "react-native"
import { Button } from "@/components/buttons/Button";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import { getTokenFromStorage, loginUser } from "@/services/userLogin";
import { GlobalContext, UserContext } from "@/utils/Provider";
import { useState, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, saveExpoPushToken } from "@/services/user";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function WelcomeScreen() {


    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();
    const context = useContext(GlobalContext);

    useEffect(() => {
        // const start = performance.now()
        console.log('register expoToken');
        registerForPushNotificationsAsync()
            .then(token => {
                saveExpoPushToken(token ?? '')
                setExpoPushToken(token ?? '')
            })
            .catch((error: any) => setExpoPushToken(`${error}`))
        // .finally(() => {
        //     const end = performance.now()
        //     const time = start - end;  // Diferencia en milisegundos
        //     console.log(`La función registerForPushNotificationsAsync tardó ${time.toFixed(3)} ms`);
        // })

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(() => {
        const handleAccessToken = async () => {
            // console.log('get access token');
            // const start = performance.now()
            const token = await getTokenFromStorage();
            // const end = performance.now()
            // const time = start - end;  // Diferencia en milisegundos
            // console.log(`La función getTokenFromStorage tardó ${time.toFixed(3)} ms`);
            if (token) {
                const { user } = await loginUser(token)
                if (user) {
                    handleShowModal(user)
                }
            }
        }
        handleAccessToken()
    }, [])

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
                        router.replace("/home")
                    }
                },  // Redirigir a crear viaje
                {
                    text: "Pasajero", onPress: () => {
                        context?.setUser(user)
                        context?.setRole('Passenger')
                        router.replace("/home")
                    }
                },  // Redirigir a lista de viajes
            ],
            { cancelable: true }
        );
    };

    const handleBlogin = () => {
        router.push("/account/login");
    }

    const handleBregistro = () => {
        router.navigate("/account/register");
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