import { Link } from "expo-router"
import { Text, View } from "react-native"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar"
import { Button } from "@/components/Button";
import { Input } from "@/components/inputs/Input";
import { InputStyled } from "@/components/inputs/InputStyled";
import { useState } from "react";
import { loginUser } from "@/services/userLogin";


export default function LoginScreen() {

    const [username, setUsername] = useState('');  
    const [password, setPassword] = useState('');

    const handleLogin = async () => {

        const res = await loginUser(username, password);//saque corchetes porque tiraba error
        console.log(res);

        if (!username || !password) {
            console.log('Error, Por favor, ingrese el username y password.');
          return;
        }
    }

    return (
        <View className="bg-gray-200 flex h-screen pl-7 pr-7 dark:bg-gray-900 ">
            
            <View className="bg-[#104736] items-center ">
                <Link className="mb-2 bg-slate-500 dark:bg-slate-900 p-1 rounded" href='/(account)/welcome'>Ir a welcome</Link>
            </View>
            
            <View className="self-center mt-8">
                    <Avatar className="w-36 h-36">
                        <AvatarImage
                            className="w-36 h-36"
                            source={require('../../assets/images/userlogoblack.png')}
                        />
                        <AvatarFallback>CG</AvatarFallback>
                    </Avatar>
            </View>

            <View className="mt-5">
                <Text className="text-md font-medium mb-2 dark:text-slate-100"
                >Username</Text>
                <InputStyled
                    setValueInput={setUsername}
                    placeholder="Ingrese su nombre de usuario"
                />
            </View>

            <View className="mt-5 mb-5">
                <Text className="text-md font-medium mb-2 dark:text-slate-100"
                >Contraseña</Text>
                <Input
                    className="focus:border focus:border-slate-900 dark:focus:border-gray-400"
                    secureTextEntry={true}
                    value={password}
                    onChange={(e) => setPassword(e.nativeEvent.text)}
                    placeholder="Ingrese su contraseña"
                />
            </View>

            <View className="items-center mt-7 mb-7">
                <Button className="w-52 bg-[#104736]" label="Iniciar sesión"
                    onPress={handleLogin} />
            </View>

            <View className="bg-slate-400 flex items-center justify-center h-20 pl-5 pr-5">
                <Text className="text-gray-200">Login</Text>
                <Link href='/(account)/register'>No tienes cuenta? registrarse</Link>
            </View>


        </View>    
    )
}