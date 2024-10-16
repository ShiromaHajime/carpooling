import { router } from "expo-router";
import { Alert, Text, View } from "react-native";
import { Button } from "@/components/buttons/Button";
import { Credentials, useAuth0 } from "react-native-auth0";
import { useState } from "react";
import { Input } from "@/components/inputs/Input";


export default function HomeScreen() {
    const { user, error, clearSession, getCredentials } = useAuth0();
    const [credentials, setCredentials] = useState<Credentials | undefined>()
    const [data, setData] = useState()

    const handleLogout = () => {
        router.replace("/(account)/login");
    }

    const Logout = async () => {
        try {
            await clearSession();
        } catch (e) {
            console.log(e);
        }
    };

    const getCred = async () => {
        try {
            const cred = await getCredentials();
            setCredentials(cred)
        } catch (e) {
            console.log(e);
        }
    };

    const getBearedToken = async () => {
        try {

        } catch (e) {
            Alert.alert(e)
        }
    }

    const getProtectedData = async () => {
        try {
            const response = await fetch('http://192.168.0.176:5000/protected', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${credentials?.accessToken}`, // Usa el accessToken aquí
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            setData(data)
        } catch (error) {
            console.error('Error al acceder a la ruta protegida:', error);
        }
    };

    return (
        <View className="bg-slate-400 flex items-center justify-center h-screen pl-5 pr-5">
            <Text className="text-gray-200">Home</Text>

            <View className="items-center mt-7 mb-5">
                <Button className="w-52 bg-[#104736] text-stone-50" label="Cerrar Sesión" onPress={handleLogout} />
                {user && <Text>Logged in as {user.name}</Text>}
                {user && <Text>Sub {user.sub}</Text>}



                {credentials && <Text>Credential expiresAt{credentials.expiresAt}</Text>}
                {credentials?.accessToken && (
                    <Input className="focus:border focus:border-slate-900 dark:focus:border-gray-400"
                        value={credentials.expiresAt.toString()}
                    />
                )}
                {credentials?.idToken && (
                    <Input className="focus:border focus:border-slate-900 dark:focus:border-gray-400"
                        value={credentials.idToken}
                    />
                )}
                {credentials?.refreshToken && <Text>Credential refreshToken{credentials.refreshToken}</Text>}
                {credentials?.scope && <Text>Credential scope{credentials.scope}</Text>}
                {credentials?.tokenType && <Text>Credential tokenType{credentials.tokenType}</Text>}

                {!user && <Text>Not logged in</Text>}
                {error && <Text>{error.message}</Text>}
                <Button label="Logout" onPress={Logout} />
                <Button label="GetCredentials" onPress={getCred} />
                <Button label="getBearedToken" onPress={getBearedToken} />
                <Button label="getProtectedData" onPress={getProtectedData} />
                {data && <Text>data: {data}</Text>}

            </View>
        </View>
    );
}