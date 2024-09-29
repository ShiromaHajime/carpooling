import { Link } from "expo-router"
import { Text, View } from "react-native"

export default function TripsScreen() {

    return (
        <View className="bg-slate-400 flex items-center justify-center h-screen pl-5 pr-5">
            <Text className="text-gray-200">TripsScreen</Text>

            <Text>Un viaje</Text>
            <Text>id 4</Text>
            <Link href='/trips/detail/4'>Ir a viaje id 4</Link>

            <Text>Un viaje</Text>
            <Text>id 4</Text>
            <Link href='/trips/detail/2'>Ir a viaje id 2</Link>

        </View>
    )
}