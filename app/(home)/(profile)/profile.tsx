import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { Button } from "@/components/buttons/Button";
import { Card } from "@/components/Card";
import { useToast } from "@/components/Toast";
import { IconCamera, IconSave } from "@/components/icons/Icons";
import { InputStyled } from "@/components/inputs/InputStyled";
import { GlobalContext } from "@/utils/Provider";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ButtonSave } from "@/components/buttons/ButtonSave";
import { firebaseConfig, storage } from "@/constants/const";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { ImageType } from "@/types/types";
import { uploadProfilePicture } from "@/services/user";
import { Skeleton } from "@/components/Skeleton";


export default function ProfileScreen() {

  const context = useContext(GlobalContext)
  const user = context?.user
  const { toast } = useToast()

  const [username, setUsername] = useState(user?.username)
  const [name, setName] = useState(user?.name)
  const [lastname, setLastname] = useState(user?.lastname)

  const router = useRouter();  // Para redirección

  const handleSave = () => {
    console.log('algo');
  }


  const ProfileAvatar = () => {

    const [image, setImage] = useState<ImageType>();
    const [userHaveImage, setUserHaveImage] = useState<boolean>(false);
    const [loadingImage, setLoadingImage] = useState<boolean>(true);

    useEffect(() => {
      if (!user) return
      if (userHaveImage) return // avoid unnecesary request
      const getProfilePictureFromStore = async () => {
        const profileRef = ref(storage, `id-user-${user.id}/profile-picture`);
        try {
          setLoadingImage(true)
          const url = await getDownloadURL(profileRef)
          setImage((prev) => {
            const filename = prev?.filename ?? 'profile-picture'
            return { uri: url, filename }
          })
          setUserHaveImage(true)
        } catch (e) { // ref doesn't exist
          setUserHaveImage(false)
          console.log('usuario sin foto de perfil');
        }
        setLoadingImage(false)
      }

      getProfilePictureFromStore()
    }, [])

    const handleChangeProfilePicture = async () => {
      if (!user) return
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        const image: ImageType = { uri: result.assets[0].uri, filename: `profile-picture-${result.assets[0].fileName}` }
        const snap = await uploadProfilePicture(image, user.id)
        if (!snap) {
          toast('Hubo un error subiendo la foto de perfil', "destructive", 3000, 'top', false)
          return
        }
        setImage(image);
        toast('Se cambió la foto de perfil con exito!', "success", 3000, 'top', false)
        console.log("snap");
        console.log(snap);
      }

    };

    return (
      <View className="self-center relative">
        <View className="absolute top-0 right-0 z-10">
          <TouchableOpacity onPress={handleChangeProfilePicture} className=" bg-primary rounded-xl blur-md p-2">
            <IconCamera size={20} />
          </TouchableOpacity>
        </View>
        <Avatar className="w-32 h-32">
          {(loadingImage && (<Skeleton className="w-32 h-32 bg-gray-400 dark:bg-gray-600 rounded-full" />))}
          {((!loadingImage) && (
            <AvatarImage
              className="w-32 h-32"
              source={{
                uri: `${image ? image.uri : 'https://png.pngtree.com/png-clipart/20230623/original/pngtree-an-illustration-of-dog-in-circle-shape-sky-png-image_9205321.png'}`,
              }}
            />
          ))}
        </Avatar>
      </View>
    )
  }

  return (
    <View className="bg-background flex h-screen pl-7 pr-7 pt-4">
      <Card className="pl-5 pr-5 pt-4 pb-4 bg-secondary rounded-md">
        <ProfileAvatar />
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
