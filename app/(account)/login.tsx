import { Link } from "expo-router"
import { Text, View } from "react-native"

export default function LoginScreen() {

    return (
        <View className="bg-slate-400 flex items-center justify-center h-screen pl-5 pr-5">
            <Text className="text-gray-200">Login</Text>
            <Link href='/(account)/register'>No tienes cuenta? registrarse</Link>
        </View>
    )
}