import { API_URL, GOOGLE_CLIENT_ID } from "@/constants/const";
import { UserAccount } from "@/types/types";
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";



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

export const loginWithGoogle = async () => {
    GoogleSignin.configure({ webClientId: GOOGLE_CLIENT_ID, });

    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (isSuccessResponse(response)) {
            console.log("response.data");
            console.log(response.data);
            // setState({ userInfo: response.data });
            Alert.alert(
                "Datos JSON",
                JSON.stringify(response.data, null, 2), // Formatea el JSON
                [{ text: "OK" }]
            );
        } else {
            // sign in was cancelled by user
        }
    } catch (error) {
        Alert.alert(
            "Datos JSON",
            JSON.stringify(error, null, 2), // Formatea el JSON
            [{ text: "OK" }]
        );
        if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                    // operation (eg. sign in) already in progress
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    // Android only, play services not available or outdated
                    break;
                default:
                // some other error happened
            }
        } else {
            // an error that's not related to google sign in occurred
        }
    }
}
export const loginUser = async (username: string, password: string) => {

    const data = {
        username,
        password
    };

    const conver = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convertir data POST a una cadena JSON
    };


    try {

        const res = await fetch(API_URL + '/auth/login', conver);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        // const response = JSON.stringify(res)
        // console.log(response);

        if (res.status == 200) {
            return res.json()
        } else return false

    } catch (error) {
        console.log(error);

        return false;
    }

}