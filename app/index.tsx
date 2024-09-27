import { Link } from "expo-router";
import { Text, View } from "react-native"

export default function IndexScreen() {

    return (
        <View className="bg-slate-400 flex items-center justify-center h-screen pl-5 pr-4">
            <Text className="text-2xl text-gray-900 text-card-foreground font-semibold leading-none tracking-tight mb-2">Pantalla inicio</Text>
            <Text className="text-sm mb-7">Esta pantalla en un futuro se borra, es el index para ir a todas las paginas</Text>
            <View>
                <Link className="mb-2 bg-slate-500 p-1 rounded" href='/(account)/welcome'>Ir a welcome</Link>
                <Link className="mb-2 bg-slate-500 p-1 rounded" href='/(account)/register'>Ir a register</Link>
                <Link className="mb-2 bg-slate-500 p-1 rounded" href='/(account)/login'>Ir a login</Link>
                <Link className="mb-2 bg-slate-500 p-1 rounded" href='/(home)/home'>Ir a home</Link>
                <Link className="mb-2 bg-slate-500 p-1 rounded" href='/(home)/trips'>Ir a trips</Link>
            </View>

        </View>
    )
}