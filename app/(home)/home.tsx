import { Link, router, useLocalSearchParams } from "expo-router";
import { Alert, Text, View } from "react-native";
import { Button } from "@/components/buttons/Button";
import { Credentials, useAuth0 } from "react-native-auth0";
import { useEffect, useState } from "react";
import { Input } from "@/components/inputs/Input";
import * as Crypto from 'expo-crypto';


export default function HomeScreen() {
    const { user, error, clearSession, getCredentials } = useAuth0();
    const [credentials, setCredentials] = useState<Credentials | undefined>()
    const [data, setData] = useState()
    const [challenge, setChallenge] = useState()
    const [url, setUrl] = useState()
    const { code } = useLocalSearchParams();

    if (code) {
        console.log("code");
        console.log(code);
    }

    const base64URLEncode = (str: string) => {
        return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    function getVerifier() {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let resultado = '';

        for (let i = 0; i < 43; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            resultado += caracteres[indice];
        }

        // Realizar las transformaciones
        resultado = base64URLEncode(resultado)

        return resultado;
    }

    useEffect(() => {
        const getHash = async () => {
            const verifier = getVerifier()
            const challenge = (await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, verifier)).substring(0, 43)
            const url = `https://dev-voifjkzdk2go4y1p.us.auth0.com/authorize?response_type=code&client_id=j60v2zaXLYBkylThZBPAm35tErH6ZmQF&code_challenge=${challenge}&code_challenge_method=S256&redirect_uri=com.fedevalle.carpooling.auth0://dev-voifjkzdk2go4y1p.us.auth0.com/android/com.fedevalle.carpooling/callback&audience=carpooling&state=xyzABC123`
            console.log("challenge");
            console.log(challenge);
            console.log("url");
            console.log(url);

            setUrl(url)
            setChallenge(challenge)

        }
        getHash()
    }, [])

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


                {challenge && <Link href={url}><Text>Google</Text></Link>}


                {credentials && <Text>Credential expiresAt{credentials.expiresAt}</Text>}
                {credentials?.accessToken && (
                    <Input className="focus:border focus:border-slate-900 dark:focus:border-gray-400"
                        value={credentials.accessToken.toString()}
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
                {code && <Input className="focus:border focus:border-slate-900 dark:focus:border-gray-400"
                    value={code.toString()}
                />}
                {data && <Text>data: {data}</Text>}

            </View>
        </View>
    );
}