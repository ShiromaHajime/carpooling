import { API_URL } from "@/constants/const";

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
            return res.json() //DEBERIA DEVOLVER TRUE
        } else return false

    } catch (error) {
        console.log(error);

        return false;
    }

}