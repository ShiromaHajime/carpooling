import { Link } from "expo-router"
import { Text, View, Image } from "react-native"
import { ThemedText } from '@/components/ThemedText';
import { Button } from "@/components/buttons/Button";
import { router } from "expo-router";
import { useEffect } from "react";
import { getAccessToken } from "@/services/auth";
import { getItemAsync, setItemAsync } from "expo-secure-store";


export default function WelcomeScreen() {

    const handleBlogin = () => {
        router.navigate("/(account)/login");
    }

    const handleBregistro = () => {
        router.navigate("/(account)/register");
    }

    useEffect(() => {

        async function saveToken(token) {
            try {
                const tokenString = JSON.stringify(token);
                await setItemAsync('accessToken', tokenString);
                console.log('Access token guardado');
            } catch (error) {
                console.log('Error al guardar el access token:', error);
            }
        }

        async function getTokenFromStorage() {
            try {
                const tokenString = await getItemAsync('accessToken');
                if (tokenString) {
                    const token = JSON.parse(tokenString);

                    console.log('Access token recuperado:', token);
                    return token;
                } else {
                    console.log('No se encontró el access token');
                    return null;
                }
            } catch (error) {
                console.log('Error al recuperar el access token:', error);
                return null;
            }
        }

        const handleAccessToken = async () => {
            const token = await getTokenFromStorage();
            if (token) {
                console.log("tokenRecuperado");
                console.log(token);
            } else {
                console.log("No hay token, pide uno");
                const newToken = await getAccessToken()
                console.log("newToken");
                console.log(newToken);
                saveToken(newToken)
            }
        }


        handleAccessToken()
    }, [])

    return (
        <View className="bg-background h-full pl-5 pr-5 justify-center">


            <View className="h-28 self-center">
                <Link href='/test'>
                    <Text className="text-foreground text-5xl">¡Bienvenido!</Text>
                </Link>
            </View>

            <View className="flex-row justify-evenly">
                <Button className="color" label="Registrarse" onPress={handleBregistro}></Button>
                <Button className="color" label="Ingresar" onPress={handleBlogin}></Button>
            </View>

        </View>

    )
}