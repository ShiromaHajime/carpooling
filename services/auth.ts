import { CLIENT_SECRET } from "@/constants/const";

const url = 'https://dev-voifjkzdk2go4y1p.us.auth0.com/oauth/token';
const data = {
    client_id: 'w2mnvgzAM4t7H5mQwFHg9TRPxGS1gbFn',
    client_secret: CLIENT_SECRET,
    audience: 'carpooling',
    grant_type: 'client_credentials'
};

export const getAccessToken = async () => { // for call api
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.error('Error:', error);
    }
}