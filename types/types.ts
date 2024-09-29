import { z } from "zod";

export interface PropsInput {
    setValueInput: Function,
    placeholder: string,
    className?: string
}

export const schemaFormUser = z.object({
    name: z.string()
        .min(1, { message: "El nombre es requerido" })
        .refine((value) => isNaN(Number(value)), { message: "El nombre no puede ser numérico" }),
    lastname: z.string()
        .min(1, { message: "El apellido es requerido" })
        .refine((value) => isNaN(Number(value)), { message: "El apellido no puede ser numérico" }),
    email: z.string()
        .email({ message: "Correo electrónico no válido" }),
    password: z.string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    username: z.string()
        .min(1, { message: "El nombre de usuario es requerido" })
        .refine((value) => isNaN(Number(value)), { message: "El nombre de usuario no puede ser numérico" }),

});

export type UserAccount = z.infer<typeof schemaFormUser>;

