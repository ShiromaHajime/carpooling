import { API_URL, storage } from "@/constants/const";
import { ImageType, User, UserAccount } from "@/types/types";
import { UserContext } from "@/utils/Provider";
import { parseUserContext } from "@/utils/utils";
import { UploadResult, ref, uploadBytes } from "firebase/storage";
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { getTokenFromStorage } from "./userLogin";

export const modifyUserValue = async (idUser: string, field: 'name' | 'lastName' | 'username', value: string) => {

    let data: any
    if (field == 'name') {
        data = {
            first_name: value
        }
    }
    if (field == 'lastName') {
        data = {
            last_name: value
        }
    }
    if (field == 'username') {
        data = {
            username: value
        }
    }
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    try {
        const res = await fetch(`${API_URL}/users/${idUser}`, options)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        if (res.status == 200) {
            return res.json()
        } else return false

    } catch (error) {
        console.log(error);
        return false;
    }

}


export const getUserById = async (id: string): Promise<UserContext | false> => {
    try {
        const res = await fetch(`${API_URL}/users/${id}`);
        if (res.status == 200) {
            const user = await res.json()
            return parseUserContext(user)
        }
        return false
    } catch (error) {
        return false
    }
}

export const getProfilePicture = () => {

}


export const uploadProfilePicture = async (image: ImageType, idUser: string): Promise<UploadResult | undefined> => {
    if (!idUser || !image) return
    try {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `id-user-${idUser}/profile-picture`);
        const snapshot = await uploadBytes(storageRef, blob);
        return snapshot
    } catch (error) {
        return
    }
}
// no se envian notificaciones del lado del cliente por temas de seguridad
// 
// export async function sendPushNotification(expoPushToken: string) { 
//     const message = {
//         to: expoPushToken,
//         sound: 'default',
//         title: 'Original Title',
//         body: 'And here is the body!',
//         data: { someData: 'goes here' },
//     };

//     await fetch('https://exp.host/--/api/v2/push/send', {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Accept-encoding': 'gzip, deflate',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(message),
//     });
// }

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

export const saveExpoPushToken = async (expoPushToken: string, idToken?: string) => {
    const token = idToken ?? await getTokenFromStorage()
    if (!token) return

    const data = {
        expo_push_token: expoPushToken
    };
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    };

    try {
        const res = await fetch(`${API_URL}/users/notifications`, options);
        if (res.status == 200) {
            const response = await res.json()
            return response
        }
        return await res.json()
    } catch (error) {
        console.log(error);

        return false
    }
}

export async function registerForPushNotificationsAsync() { // boilerplate, ignore this
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}