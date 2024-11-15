import { Button } from "@/components/buttons/Button";
import { Card } from "@/components/Card";
import { useToast } from "@/components/Toast";
import { IconCamera, IconEdit, IconSave } from "@/components/icons/Icons";
import { InputStyled } from "@/components/inputs/InputStyled";
import { GlobalContext, UserContext, initialState } from "@/utils/Provider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ButtonSave } from "@/components/buttons/ButtonSave";
import { ProfileAvatar } from "./ProfileAvatar";
import { getUserById, modifyUserValue } from "@/services/user";
import { parseUrlParams } from "@/utils/utils";
import { saveToken } from "@/services/userLogin";
import { Skeleton } from "@/components/Skeleton";


export default function ProfileScreen() {

  const { idDriver } = useLocalSearchParams();
  const context = useContext(GlobalContext)
  const userContext = context.user
  console.log("userContext");
  console.log(userContext);
  console.log("idDriver recibido");
  console.log(idDriver);

  const { toast } = useToast()
  const canEdit = idDriver ? false : true
  const router = useRouter();  // Para redirección

  const [userProfile, setUserProfile] = useState<UserContext>();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const getUser = async (idDriver: any) => {
      setLoading(true)
      const user = await getUserById(parseUrlParams(idDriver))
      setLoading(false)
      router.setParams({})
      if (user) {
        console.log("userByID");
        console.log(user);
        setUserProfile(user)
      } else {
        toast('Error al buscar perfil del usuario', 'destructive', 3000, 'top', false)
        router.replace("/home/index")
      }
    }
    if (idDriver) {
      getUser(idDriver)
    } else {
      setUserProfile(userContext)
      setLoading(false)
    }
  }, [])

  const handleLogOut = () => {
    saveToken('')
    context.setUser(initialState)
    router.replace({ pathname: "/" })
  }

  interface InputLineProps {
    initialvalue: string,
    field: 'name' | 'lastName' | 'username',
    canEdit: boolean,
  }

  const InputLine = ({ initialvalue, field, canEdit }: InputLineProps) => {


    const firstValue = useMemo(() => (initialvalue), [])
    const [value, setValue] = useState(initialvalue)
    const [editing, setEditing] = useState(false)

    const saveChanges = async () => {
      if (!userProfile) return
      toast('Modificando campo del usuario', 'info', 3000)
      const res = await modifyUserValue(userProfile.id, field, value)
      if (res) {
        toast('Usuario modificado con éxito', 'success', 3000, 'top', false)
      }
    }
    const handlePress = () => {
      if (editing) { // user press save
        if (firstValue != value) {
          saveChanges()
        }
      }
      setEditing((prev) => !prev)
    }

    const label = field == 'name' ? 'Nombre:' : field == 'lastName' ? 'Apellido:' : field == 'username' ? 'Usuario:' : ''
    if (canEdit) {
      return (
        <View className="mt-3 flex flex-row justify-start items-center gap-4">
          <Text className="font-medium text-foreground">{label}</Text>
          <View className="flex-1">
            {editing ?
              <InputStyled
                setValueInput={setValue}
                valueInput={value}
                placeholder="Ingrese su nombre"
              />
              :
              <View className="p-3"><Text className=" font-medium text-foreground justify-self-center">{value}</Text></View>
            }
          </View>
          <TouchableOpacity className="justify-self-start" onPress={handlePress}>
            {editing ? <IconSave /> : <IconEdit />}
          </TouchableOpacity>
        </View>
      )
    }

    // if user only can read

    return (
      <View className="mt-3 flex flex-row justify-center items-center justify-self-center ">
        <View className="flex-1" />
        <View><Text className="font-medium text-foreground">{label}</Text></View>
        <View className="p-3 flex-1"><Text className=" font-medium text-foreground justify-self-center">{value}</Text></View>
        <View className="flex-1" />
      </View>
    )

  }

  if (!userProfile) return (
    <View>
      <View className="bg-background flex h-screen pl-7 pr-7 pt-4">
        <Card className="pl-5 pr-5 pt-4 pb-4 bg-secondary rounded-md">
          <Skeleton className="w-32 h-32 rounded-full self-center" />
          <Skeleton className="w-full h-8 mt-3" />
          <Skeleton className="w-full h-8 mt-3" />
          <Skeleton className="w-full h-8 mt-3" />
          <View className="mt-4" />
          <View className="self-center justify-center mt-5">
            <Button label="Ver mis vehículos"
              className="rounded bg-primary self-center w-52 h-11"
              onPress={() => router.navigate({ pathname: "/home/profile/vehicles" })} />
          </View>
        </Card>
        <View className="my-6" />
        <Button label="Cerrar sesión" variant={"destructive"} onPress={handleLogOut} />
      </View>
    </View>
  )


  return (
    <View className="bg-background flex h-screen pl-7 pr-7 pt-4">
      <Card className="pl-5 pr-5 pt-4 pb-4 bg-secondary rounded-md">
        <ProfileAvatar idUser={userProfile.id} canChangeProfilePicture={canEdit} />
        <InputLine initialvalue={userProfile.name} field="name" canEdit={canEdit} />
        <InputLine initialvalue={userProfile.lastname} field="lastName" canEdit={canEdit} />
        <InputLine initialvalue={userProfile.username} field="username" canEdit={canEdit} />
        <View className="mt-4" />

        {
          canEdit ?
            <View className="self-center justify-center mt-5">
              <Button label="Ver mis vehículos"
                className="rounded bg-primary self-center w-52 h-11"
                onPress={() => router.navigate("/home/profile/vehicles")} />
            </View>
            :
            <View className="self-center justify-center mt-5">
              <Button label="Ver vehículos"
                className="rounded bg-primary self-center w-52 h-11"
                onPress={() => router.navigate({ pathname: "/home/profile/vehicles", params: { idDriver: idDriver } })}
              />
            </View>
        }

      </Card>
      <View className="my-6" />
      {canEdit && (<Button label="Cerrar sesión" variant={"destructive"} onPress={handleLogOut} />)}
    </View>

  );
}
