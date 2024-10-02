//
// Aca hay funciones varias (o basuras) que pueden llamarse desde cualquier lado
//

export const parseUrlParams = (param: string | string[]): string => {

    if (typeof param == 'string') {
        return param
    }
    if (param.length > 0) {
        return param[0]
    }
    return ''
}