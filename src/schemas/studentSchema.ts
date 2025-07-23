import { FocoCorpo, FocoTreino, Sexo } from "@prisma/client"
import z from "zod"

export const studentSchema = z.object({
    nome: z.string().optional(),
    sobrenome: z.string().optional(),
    foto: z.any(),
    sexo: z.enum(Sexo).optional(),
    foco_treino: z.enum(FocoTreino).optional(),
    peso: z.number().optional(),
    altura: z.number().optional(),
    idade: z.number().optional(),
    data_matricula: z.string().optional(),
    email: z.email().optional(),
    senha: z.string().min(8),
    telefone: z.string().length(15).optional(),
    foco_corpo: z.enum(FocoCorpo).optional(),
    observacao: z.string().optional(),
    treino_dias_por_semana: z.number().optional(),
    planoId: z.uuid(),
    personalId: z.uuid()
});

export const loginStudentSchema = z.object({
    email: z.email().optional(),
    senha: z.string().min(8),
    telefone: z.string().length(15).optional(),
    rememberMe: z.boolean().default(false),
});


export type studentSchemaDTO = z.infer<typeof studentSchema>;
export type LoginStudentSchemaDTO = z.infer<typeof loginStudentSchema>;