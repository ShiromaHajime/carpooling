import { API_URL } from "@/constants/const";
import { UserAccount } from "@/types/input";


export const createUser = async (userAccount: UserAccount) => {

    console.log("API_URL");
    console.log(API_URL);

    const url = 'http://127.0.0.1:5000/users';
    const data = {
        nombre: "Fede",
        apellido: "valle",
        email: "santiagofirz97@gmail.com",
        password: "test1234",
        username: "santiagof",
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
        const res = await fetch('http://127.0.0.1:5000/users', options);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        // const response = JSON.stringify(res)
        // console.log(response);

        if (res.status == 201) {
            return res.json()
        } else return false

    } catch (error) {
        console.log(error);

        return false;
    }




    // fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok ' + response.statusText);
    //         }
    //         return response.json();
    //     })
    //     .catch((error) => {
    //         console.error('Error:', error);
    //     });
}