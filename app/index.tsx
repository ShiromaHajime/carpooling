import { Link } from "expo-router"
import { Text, View } from "react-native"

export default function WelcomeScreen() {

    return (
        <View className="bg-slate-400 flex items-center justify-center h-screen pl-5 pr-5">
            <Link href='/test' className="text-gray-200">Welcome</Link>
            <Link href='/(account)/login'>login</Link>
            <Link href='/(account)/register'>register</Link>
        </View>
    )
}