import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar"
import { Button } from "@/components/Button";
import { Input } from "@/components/inputs/Input";
import { InputStyled } from "@/components/inputs/InputStyled";
import { createUser } from "@/services/user";
import { useState } from "react";
import { Text, View } from "react-native"

export default function RegisterScreen() {

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleRegister = async () => {
        console.log('handle register');
        console.log('values');


        // {
        //     "nombre":"Fede",
        //     "apellido":"Fritz",
        //     "email":"santiagofirz97@gmail.com",
        //     "password":"test1234",
        //     "username":"santiagof",
        //     "validacionMail":0
        // }

        const res = await createUser({ name: name, lastname: lastName, email: email, username: username, password: password, mail_validation: 0 })
        console.log(res);

    }

    return (
        <View className="bg-gray-200 flex h-screen pl-7 pr-7 dark:bg-gray-900 ">
            <View className="self-center mt-8">
                <Avatar className="w-36 h-36">
                    <AvatarImage
                        className="w-36 h-36"
                        source={{
                            uri: 'https://png.pngtree.com/png-clipart/20230623/original/pngtree-an-illustration-of-dog-in-circle-shape-sky-png-image_9205321.png',
                        }}
                    />
                    <AvatarFallback>CG</AvatarFallback>
                </Avatar>
            </View>

            <View className="mt-2">
                <Text className="text-md font-medium mb-2 dark:text-slate-100"
                >Nombre</Text>
                <InputStyled
                    className=""
                    setValueInput={setName}
                    placeholder="Ingrese su nombre"
                />
            </View>


            <View className="mt-5">
                <Text className="text-md font-medium mb-2 dark:text-slate-100"
                >Apellido</Text>
                <InputStyled
                    setValueInput={setLastName}
                    placeholder="Ingrese su apellido"
                />
            </View>

            <View className="mt-5">
                <Text className="text-md font-medium mb-2 dark:text-slate-100"
                >Username</Text>
                <InputStyled
                    setValueInput={setUsername}
                    placeholder="Ingrese su nombre de usuario"
                />
            </View>

            <View className="mt-5">
                <Text className="text-md font-medium mb-2 dark:text-slate-100"
                >Email</Text>
                <InputStyled
                    setValueInput={setEmail}
                    placeholder="Ingrese su Email"
                />
            </View>

            <View className="mt-5">
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

            <View className="items-center mt-7">
                <Button className="w-52 bg-[#7d3bed]" label="Registrarse"
                    onPress={handleRegister} />
            </View>

        </View>
    )
}