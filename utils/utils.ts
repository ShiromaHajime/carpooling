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

export const parseErrors = (result: any) => {
    // Manejar errores
    const newErrors: Record<string, string> = {};
    result.error.errors.forEach((error: any) => {
        newErrors[error.path[0]] = error.message;
    });
    return newErrors
}