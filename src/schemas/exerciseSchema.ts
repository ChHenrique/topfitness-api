import { z } from "zod";

export const exerciseSchema = z.object({
  nome: z.string(),
  foto: z.any(),
  descricao: z.string(),
  repeticoes: z.coerce.number().int(),
  execucoes: z.coerce.number().int(),
  intervalo_descanso: z.coerce.number().int(),
  treino_id: z.string()
});

export type exerciseDTO = z.infer<typeof exerciseSchema>;