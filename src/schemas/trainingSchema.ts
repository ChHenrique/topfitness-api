import z from "zod";

export const focoCorpoEnum = z.enum([
  "COSTAS",
  "PERNA",
  "BRACO",
  "GLUTEOS",
  "CORPO_TODO",
]);

export const trainingSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  descricao: z.string(),
  foco_corpo: focoCorpoEnum,
  foto: z.any().optional(), 
});

export type TrainingSchemaDTO = z.infer<typeof trainingSchema>;
