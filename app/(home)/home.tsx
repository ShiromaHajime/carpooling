import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "@/components/buttons/Button";
import { useAuth0 } from "react-native-auth0";


export default function HomeScreen() {
    const { user, error } = useAuth0();

    const handleLogout = () => {
        router.replace("/(account)/login");
    }
    const { clearSession } = useAuth0();

    const Logout = async () => {
        try {
            await clearSession();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View className="bg-slate-400 flex items-center justify-center h-screen pl-5 pr-5">
            <Text className="text-gray-200">Home</Text>

            <View className="items-center mt-7 mb-5">
                <Button className="w-52 bg-[#104736] text-stone-50" label="Cerrar Sesión" onPress={handleLogout} />
                {user && <Text>Logged in as {user.name}</Text>}
                {!user && <Text>Not logged in</Text>}
                {error && <Text>{error.message}</Text>}
                <Button label="Logout" onPress={Logout} />
            </View>
        </View>
    );
}