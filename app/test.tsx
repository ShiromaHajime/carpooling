import { Link } from "expo-router";
import { Text, View } from "react-native"
import { colorScheme, useColorScheme } from "nativewind";
import { Button } from "@/components/buttons/Button";

export default function TestScreen() {
    function ModeToggle() {
        const { colorScheme, setColorScheme } = useColorScheme();
        return (
            <Button
                label="Cambiar modo oscuro/claro"
                variant="ghost"
                onPress={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")}
            />
        )
    }

    return (
        <View className="bg-background flex items-center justify-center h-screen pl-5 pr-5">
            <Text className="text-2xl text-card-foreground font-semibold leading-none tracking-tight mb-2">Pantalla inicio</Text>
            <Text className="text-sm text-foreground mb-7">Esta pantalla en un futuro se borra, es el index para ir a todas las pantallas</Text>
            <ModeToggle />
            <View className="mt-5">
                <Link className="mb-2 bg-slate-500 p-1 rounded" href='/(account)/register'>Ir a register</Link>
                <Link className="mb-2 bg-slate-500 p-1 rounded" href='/(account)/login'>Ir a login</Link>
                <Link className="mb-2 bg-slate-500 p-1 rounded" href='/(home)/home'>Ir a home</Link>
                <Link className="mb-2 bg-slate-500 p-1 rounded" href='/(home)/trips/tripList'>Ir a trips</Link>
                <Link className="mb-2 bg-slate-500 p-1 rounded" href='/(home)/trips/createTrip'>Ir a createTrip</Link>
                <Link className="mb-2 bg-slate-500 p-1 rounded" href='/(home)/trips/detail/4'>Ir a detail trip 4</Link>
                <Link className="mb-2 bg-slate-500 p-1 rounded" href='/map'>Pantalla map test</Link>
            </View>
        </View>
    )
}