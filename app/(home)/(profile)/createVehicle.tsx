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

export default function CreateVehicleScreen() {

  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();


  const handleRegister = async () => {
    console.log('handle register');
    console.log('values');
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
      console.log(result.data);
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
    <ScrollView className="bg-background ">
      <View className="flex h-max p-7 ">
        <View className="mt-2">
          <Text className="text-md font-medium mb-2 text-foreground">
            Nombre
          </Text>
          <InputStyled
            className=""
            setValueInput={setName}
            placeholder="Ingrese su nombre"
          />
          {errors.name && <Text style={{ color: 'red' }}>{errors.name}</Text>}
        </View>


        <View className="mt-5">
          <Text className="text-md font-medium mb-2 text-foreground"
          >Apellido</Text>
          <InputStyled
            setValueInput={setLastname}
            placeholder="Ingrese su apellido"
          />
          {errors.lastname && <Text style={{ color: 'red' }}>{errors.lastname}</Text>}

        </View>

        <View className="mt-5">
          <Text className="text-md font-medium mb-2 text-foreground"
          >Username</Text>
          <InputStyled
            setValueInput={setUsername}
            placeholder="Ingrese su nombre de usuario"
          />
          {errors.username && <Text style={{ color: 'red' }}>{errors.username}</Text>}

        </View>

        <View className="mt-5">
          <Text className="text-md font-medium mb-2 text-foreground"
          >Email</Text>
          <InputStyled
            setValueInput={setEmail}
            placeholder="Ingrese su Email"
          />
          {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}

        </View>

        <View className="mt-5">
          <Text className="text-md font-medium mb-2 text-foreground"
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
          <Button className="w-52 bg-primary" label="Registrarse"
            onPress={handleRegister} />
        </View>
      </View>

    </ScrollView >
  )
}