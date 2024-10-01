
export const joinTrip = async ({ id_passager, id_trip }: { id_passager: string, id_trip: string }) => {

    console.log("API_URL de la variable de entorno");
    // console.log(API_URL);

    //               Ejemplo body
    // {
    //     "nombre":"Fede",
    //     "apellido":"Fritz",
    //     "email":"santiagofirz97@gmail.com",
    //     "password":"test1234",
    //     "username":"santiagof",
    //     "validacionMail":0
    // }

    const url = API_URL ?? 'http://127.0.0.1:5000';
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
        const res = await fetch(`${url}/users`, options);
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