// http://192.168.0.176:5000 es mi ip local harcodeada, probablemente la tuya sea otra.
// Lo ideal es poner en un archivo .env en la raiz del proyecto la ip de la api rest

// archivo .env que tiene las variables de entorno
// EXPO_PUBLIC_API_URL = https://dscarpooling-back.alwaysdata.net
//

export const API_URL = process.env.EXPO_PUBLIC_LOCAL_API_URL ?? 'https://carpooling-backend.alwaysdata.net/'