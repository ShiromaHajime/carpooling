import { useEffect, useState } from "react";
import { firebaseConfig, storage } from "@/constants/const";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { ImageType } from "@/types/types";
import { uploadProfilePicture } from "@/services/user";
import { Skeleton } from "@/components/Skeleton";
import { IconCamera, IconSave } from "@/components/icons/Icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { useToast } from "@/components/Toast";
import { TouchableOpacity, View } from "react-native";

export const ProfileAvatar = ({ idUser, canChangeProfilePicture }: { idUser: string, canChangeProfilePicture: boolean }) => {
    const { toast } = useToast()

    const [image, setImage] = useState<ImageType>();
    const [userHaveImage, setUserHaveImage] = useState<boolean>(false);
    const [loadingImage, setLoadingImage] = useState<boolean>(true);

    useEffect(() => {
        if (!idUser) return
        if (userHaveImage) return // avoid unnecesary request
        const getProfilePictureFromStore = async () => {
            const profileRef = ref(storage, `id-user-${idUser}/profile-picture`);
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
        if (!idUser) return
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            const image: ImageType = { uri: result.assets[0].uri, filename: `profile-picture-${result.assets[0].fileName}` }
            const snap = await uploadProfilePicture(image, idUser)
            if (!snap) {
                toast('Hubo un error subiendo la foto de perfil', "destructive", 3000, 'top', false)
                return
            }
            setImage(image);
            toast('Se cambió la foto de perfil con exito!', "success", 3000, 'top', false)
        }

    };

    return (
        <View className="self-center relative">
            {(canChangeProfilePicture) && (
                <View className="absolute top-0 right-0 z-10">
                    <TouchableOpacity onPress={handleChangeProfilePicture} className=" bg-primary rounded-xl blur-md p-2">
                        <IconCamera size={20} />
                    </TouchableOpacity>
                </View>
            )}
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
