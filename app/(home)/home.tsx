import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "@/components/buttons/Button";


export default function HomeScreen() {

    const handleLogout = () => {
        router.replace("/(account)/login");
    }

    return (
        <View className="bg-slate-400 flex items-center justify-center h-screen pl-5 pr-5">
            <Text className="text-gray-200">Home</Text>

            <View className="items-center mt-7 mb-5">
                <Button className="w-52 bg-[#104736] text-stone-50" label="Cerrar Sesión" onPress={handleLogout} />

            </View>
        </View>
    );
}