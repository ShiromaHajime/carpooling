//
// Aca hay funciones varias (o basuras) que pueden llamarse desde cualquier lado
//

import { SafeParseReturnType } from "zod"

export const parseUrlParams = (param: string | string[]): string => {

    if (typeof param == 'string') {
        return param
    }
    if (param.length > 0) {
        return param[0]
    }
    return ''
}


// Función para calcular la distancia usando la fórmula de Haversine
export const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en km
};

export const parseErrors = (result: any) => {
    // Manejar errores
    const newErrors: Record<string, string> = {};
    result.error.errors.forEach((error: any) => {
        newErrors[error.path[0]] = error.message;
    });
    return newErrors
}