import { Link } from "expo-router"
import { Text, View, Image } from "react-native"
import { ThemedText } from '@/components/ThemedText';
import { Button } from "@/components/buttons/Button";
import { router } from "expo-router";


export default function WelcomeScreen() {

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