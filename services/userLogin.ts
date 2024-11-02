import { API_URL, GOOGLE_CLIENT_ID, auth } from "@/constants/const";
import { UserContext } from "@/utils/Provider";
import { parseUserContext } from "@/utils/utils";
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from "@react-native-google-signin/google-signin";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { UserCredential, signInWithEmailAndPassword } from "firebase/auth";
interface NewUser {
    name: string;
    lastname: string;
    username: string;
}

interface UserResponse extends NewUser {
    id: string;
}

interface CreateUserResponse {
    data: UserResponse | null;
    error: string | null;
}

export const createUser = async (userAccount: NewUser, idToken: string): Promise<CreateUserResponse> => {

    const url = API_URL ?? 'http://192.168.0.176:5000';
    const data = {
        first_name: userAccount.name,
        last_name: userAccount.lastname,
        username: userAccount.username,
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(data)
    };

    try {
        const res = await fetch(`${url}/auth`, options);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        if (res.status === 201) {
            const userData: UserResponse = await res.json();
            return { data: userData, error: null };
        } else {
            return { data: null, error: "Error creando usuario" };
        }

    } catch (error) {
        console.log(error);
        return { data: null, error: "Error creando usuario" };
    }
};


type User = {
    user: {
        id: string;
        name: string | null;
        email: string;
        photo: string | null;
        familyName: string | null;
        givenName: string | null;
    };
    scopes: string[];
    idToken: string | null;
    serverAuthCode: string | null;
};

export async function saveToken(token: string) {
    try {
        await setItemAsync('accessToken', token);
        console.log('Access token guardado');
    } catch (error) {
        console.log('Error al guardar el access token:', error);
    }
}

export async function getTokenFromStorage() {
    try {
        const token = await getItemAsync('accessToken');
        if (token) {
            return token;
        } else {
            return null;
        }
    } catch (error) {
        console.log('Error al recuperar el access token:', error);
        return null;
    }
}


export const loginWithGoogle = async (): Promise<{ idToken?: string | null; error?: true, userGoogle?: User }> => {
    GoogleSignin.configure({ webClientId: GOOGLE_CLIENT_ID, }); // TODO: CONFIG TO IOS

    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (isSuccessResponse(response)) {
            return { userGoogle: response.data, idToken: response.data.idToken }
        } else {
            return { error: true }
        }
    } catch (error) {
        if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                    // operation (eg. sign in) already in progress
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    // Android only, play services not available or outdated
                    break;
                default:
                    return { error: true }
            }
            return { error: true }
        } else {
            return { error: true }
        }
    }
}

interface LoginUserResponse {
    user?: UserContext,
    errorHttp?: number
}

export const signInUserWithEmailAndPassword = async (email: string, password: string): Promise<{ error?: string, userCredential?: UserCredential }> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { userCredential: userCredential };
    } catch (error: any) {
        return { error: error.message }
    }
};

export const loginUser = async (idToken: string): Promise<LoginUserResponse> => {
    if (!idToken) return { errorHttp: 401 }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
        },
    };

    try {
        const res = await fetch(API_URL + '/auth/login', options);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        if (res.status == 401) return { errorHttp: 401 }
        if (res.status == 404) return { errorHttp: 404 }
        if (res.status == 403) return { errorHttp: 403 }
        if (res.status == 200) {
            const user = await res.json()
            return { user: parseUserContext(user) }
        } else return { errorHttp: 500 }

    } catch (error) {
        return { errorHttp: 500 }
    }

}
