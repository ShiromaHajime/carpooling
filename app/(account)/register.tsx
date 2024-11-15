import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar"
import { Button } from "@/components/buttons/Button";
import { useToast } from "@/components/Toast";
import { Input } from "@/components/inputs/Input";
import { InputStyled } from "@/components/inputs/InputStyled";
import { schemaFormUser } from "@/types/types";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/constants/const";
import { createUser, loginWithGoogle, saveToken } from "@/services/userLogin";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IconGoogle } from "@/components/icons/Icons";

export default function RegisterScreen() {

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { toast } = useToast();

    const validateCreateAccountGoogle = (name: string, lastname: string, username: string) => {
        let newErrors: Record<string, string> = {}
        if (!name) {
            newErrors["name"] = "El nombre es requerido"
        } else {
            if (name.length > 0 && !isNaN(Number(name))) {
                newErrors["name"] = "El nombre no puede ser numérico"
            }
        }

        if (!lastname) {
            newErrors["lastname"] = "El apellido es requerido"
        } else {
            if (lastname.length > 0 && !isNaN(Number(lastname))) {
                newErrors["lastname"] = "El apellido no puede ser numérico"
            }
        }

        if (!username) {
            newErrors["username"] = "El nombre de usuario es requerido"
        } else {
            if (username.length > 0 && !isNaN(Number(username))) {
                newErrors["username"] = "El nombre de usuario no puede ser numérico"
            }
        }
        return newErrors
    }

    const handleRegisterGoogle = async () => {
        const errors = validateCreateAccountGoogle(name, lastname, username)
        if (Object.keys(errors).length > 0) {
            setErrors(errors)
            console.log(errors);
            return
        }

        const { idToken } = await loginWithGoogle()
        if (!idToken) return toast('Hubo un error iniciando sesión con google', 'destructive', 3000, 'top', false)

        const { data, error } = await createUser({ name, lastname, username }, idToken);
        if (error) return toast('Hubo un error iniciando sesión con google', 'destructive', 3000, 'top', false)

        toast('Usuario creado exitosamente!', 'success', 2300, 'top', false)
        router.replace({ pathname: "/(account)/login" })
    }

    const handleRegister = async () => {
        const result = schemaFormUser.safeParse({ name, lastname, username, email, password });
        if (!result.success) {
            // Manejar errores
            const newErrors: Record<string, string> = {};
            result.error.errors.forEach((error) => {
                newErrors[error.path[0]] = error.message;
            });
            setErrors(newErrors);
            return
        }

        let idToken, newUser;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Signed up
            const user = userCredential.user;
            newUser = user
            idToken = await user.getIdToken();
            saveToken(idToken)
        } catch (error: any) {
            const errorMessage = error.message;
            return toast(errorMessage, 'destructive', 3000, 'top', false);
        }
        const res = await createUser({ name, lastname, username }, idToken)
        if (res) {
            toast('Usuario creado exitosamente!', 'success', 2300, 'top', false)
            sendEmailVerification(newUser)
            toast(`Se envio un email a "${email}" para confirmar tu correo`, 'success', 5000, 'top', false)
            router.replace({ pathname: "/(account)/login" })
        } else {
            toast('Hubo un error al registrar al usuario', 'destructive', 2500, 'top', false)
        }

    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View className="bg-gray-200 pl-7 pr-7 min-h-full dark:bg-gray-900 ">
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
                    <Text className="font-medium mb-2 dark:text-slate-100"
                    >Nombre *</Text>
                    <InputStyled
                        className=""
                        setValueInput={setName}
                        placeholder="Ingrese su nombre"
                    />
                    {errors.name && <Text style={{ color: 'red' }}>{errors.name}</Text>}
                </View>


                <View className="mt-5">
                    <Text className="font-medium mb-2 dark:text-slate-100"
                    >Apellido *</Text>
                    <InputStyled
                        setValueInput={setLastname}
                        placeholder="Ingrese su apellido"
                    />
                    {errors.lastname && <Text style={{ color: 'red' }}>{errors.lastname}</Text>}

                </View>

                <View className="mt-5 mb-4">
                    <Text className="font-medium mb-2 dark:text-slate-100"
                    >Username *</Text>
                    <InputStyled
                        setValueInput={setUsername}
                        placeholder="Ingrese su nombre de usuario"
                    />
                    {errors.username && <Text style={{ color: 'red' }}>{errors.username}</Text>}
                </View>

                <TouchableOpacity onPress={handleRegisterGoogle} className="w-72">
                    <View className="bg-[#4888f4] flex flex-row w-72 justify-between self-center items-center rounded-lg border border-border px-1 py-1">
                        <View className="bg-white p-2 rounded-md"><IconGoogle className="w-8 h-8" /></View>
                        <Text className="text-white font-medium text-lg">Crear cuenta con Google</Text>
                        <View />
                    </View>
                </TouchableOpacity>
                <View className="mb-6" />
                <Text className="text-md font-medium mb-2 dark:text-slate-100 mt-2 self-center">O creá tu cuenta con email y contraseña</Text>
                <View className="mt-4">
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