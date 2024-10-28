import { API_URL, storage } from "@/constants/const";
import { ImageType, User, UserAccount } from "@/types/types";
import { UserContext } from "@/utils/Provider";
import { UploadResult, ref, uploadBytes } from "firebase/storage";


export const createUser = async (userAccount: UserAccount) => {

    console.log("API_URL de la variable de entorno");
    console.log(API_URL);

    const url = API_URL ?? 'http://192.168.0.176:5000'; //IP DE API REST LOCAL
    const data = {
        name: userAccount.name,
        lastname: userAccount.lastname,
        email: userAccount.email,
        password: userAccount.password,
        username: userAccount.username,
        validacionMail: 0
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convertir meetingDTO a una cadena JSON
    };

    try {
        console.log('hace fetch');

        const res = await fetch(`${url}/users`, options);
        console.log('tern fetch');
        console.log(res);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`); //falta manejo de errores si usuario ya existe
        }

        if (res.status == 201) {
            return res.json()
        } else return false

    } catch (error) {
        console.log(error);
        return false;
    }

}

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

const parseUserContext = (user: any): UserContext => {
    const newUser: UserContext = {
        id: user.id,
        email: user.email,
        creation_date: user.creation_date,
        lastname: user.last_name,
        name: user.first_name,
        username: user.username
    }
    return newUser
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