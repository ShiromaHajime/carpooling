import { API_URL, storage } from "@/constants/const";
import { ImageType, User, UserAccount } from "@/types/types";
import { UserContext } from "@/utils/Provider";
import { parseUserContext } from "@/utils/utils";
import { UploadResult, ref, uploadBytes } from "firebase/storage";

export const modifyUserValue = async (idUser: number, field: 'name' | 'lastName' | 'username', value: string) => {

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


export const uploadProfilePicture = async (image: ImageType, idUser: number): Promise<UploadResult | undefined> => {
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