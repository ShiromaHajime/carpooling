import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar"
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";
import { Input } from "@/components/inputs/Input";
import { InputStyled } from "@/components/inputs/InputStyled";
import { createUser } from "@/services/user";
import { schemaFormUser } from "@/types/types";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native"

export default function RegisterScreen() {

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { toast } = useToast();


    const handleRegister = async () => {
        const result = schemaFormUser.safeParse({ name, lastname, username, email, password });

        if (!result.success) {
            // Manejar errores
            const newErrors: Record<string, string> = {};
            result.error.errors.forEach((error) => {
                newErrors[error.path[0]] = error.message;
            });
            setErrors(newErrors);
        } else {
            // Datos válidos
            setErrors({})
            toast('Enviando datos...', 'info', 1200, 'top')
            const res = await createUser({ name: name, lastname: lastname, email: email, username: username, password: password })
            if (res) {
                toast('Usuario creado exitosamente!', 'success', 2300, 'top', false)
                router.replace('/login')
            } else {
                toast('Hubo un error al registrar al usuario', 'destructive', 2500, 'top', false)
            }

        }



    }

    return (
        <ScrollView>
            <View className="bg-gray-200 flex h-max pl-7 pr-7 dark:bg-gray-900 ">
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
                    {errors.name && <Text style={{ color: 'red' }}>{errors.name}</Text>}
                </View>


                <View className="mt-5">
                    <Text className="text-md font-medium mb-2 dark:text-slate-100"
                    >Apellido</Text>
                    <InputStyled
                        setValueInput={setLastname}
                        placeholder="Ingrese su apellido"
                    />
                    {errors.lastname && <Text style={{ color: 'red' }}>{errors.lastname}</Text>}

                </View>

                <View className="mt-5">
                    <Text className="text-md font-medium mb-2 dark:text-slate-100"
                    >Username</Text>
                    <InputStyled
                        setValueInput={setUsername}
                        placeholder="Ingrese su nombre de usuario"
                    />
                    {errors.username && <Text style={{ color: 'red' }}>{errors.username}</Text>}

                </View>

                <View className="mt-5">
                    <Text className="text-md font-medium mb-2 dark:text-slate-100"
                    >Email</Text>
                    <InputStyled
                        setValueInput={setEmail}
                        placeholder="Ingrese su Email"
                    />
                    {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}

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
                    {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}

                </View>

                <View className="items-center mt-7 mb-5">
                    <Button className="w-52 bg-[#7d3bed]" label="Registrarse"
                        onPress={handleRegister} />
                </View>
            </View>
        </ScrollView>
    )
}