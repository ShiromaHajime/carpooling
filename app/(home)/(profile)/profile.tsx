import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/buttons/Button";
import { Card } from "@/components/Card";
import { useToast } from "@/components/Toast";
import { IconSave } from "@/components/icons/Icons";
import { InputStyled } from "@/components/inputs/InputStyled";
import { GlobalContext } from "@/utils/Provider";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ButtonSave } from "@/components/buttons/ButtonSave";

export default function ProfileScreen() {

  const context = useContext(GlobalContext);
  const user = context?.user
  const [username, setUsername] = useState(user?.username);
  const [name, setName] = useState(user?.name);
  const [lastname, setLastname] = useState(user?.lastname);


  const router = useRouter();  // Para redirección

  const handleSave = () => {
    console.log('algo');

  }

  return (
    <View className="bg-background flex h-screen pl-7 pr-7 pt-4">
      <Card className="pl-5 pr-5 pt-4 pb-4 bg-secondary rounded-md">
        <View className="self-center">
          <Avatar className="w-32 h-32">
            <AvatarImage
              className="w-32 h-32"
              source={{
                uri: 'https://png.pngtree.com/png-clipart/20230623/original/pngtree-an-illustration-of-dog-in-circle-shape-sky-png-image_9205321.png',
              }}
            />
            <AvatarFallback>CG</AvatarFallback>
          </Avatar>
        </View>

        <View className="mt-3 flex flex-row justify-start items-center gap-4">
          <Text className="text-md font-medium text-foreground">Nombre</Text>
          <View className="flex-1">
            <InputStyled
              setValueInput={setName}
              valueInput={name}
              placeholder="Ingrese su nombre"
            />
          </View>
          <TouchableOpacity className="justify-self-start">
            <IconSave />
          </TouchableOpacity>
        </View>

        <View className="mt-3 flex flex-row justify-start items-center gap-4">
          <Text className="text-md font-medium text-foreground">Apellido</Text>
          <View className="flex-1">
            <InputStyled
              setValueInput={setLastname}
              valueInput={lastname}
              placeholder="Ingrese su apellido"
            />
          </View>
          <ButtonSave onPress={handleSave} />
        </View>

        <View className="mt-3 flex flex-row justify-start items-center gap-4">
          <Text className="text-md font-medium text-foreground">Usuario</Text>
          <View className="flex-1">
            <InputStyled
              className="w-full"
              setValueInput={setUsername}
              valueInput={username}
              placeholder="Ingrese su nombre de usuario"
            />
          </View>

          <TouchableOpacity className="justify-self-start">
            <IconSave />
          </TouchableOpacity>
        </View>

        <View className="mt-4" />
        <View className="self-center justify-center mt-5">
          <Button label="Ver mis vehículos"
            className="rounded bg-primary self-center w-52 h-11"
            onPress={() => router.navigate({ pathname: "/(home)/(profile)/vehicles" })} />
        </View>
      </Card>
    </View>

  );
}
