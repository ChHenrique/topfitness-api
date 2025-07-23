import z, { email } from "zod";

export const userLoginSchema = z.object({
    email: email().optional(),
    telefone: z.string().optional(),
    senha: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
    rememberMe: z.boolean().default(false),
})  

export type UserLoginSchemaDTO = z.infer<typeof userLoginSchema>;