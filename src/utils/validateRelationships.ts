import { prisma } from "src/config/prisma";
import { ServerError } from "src/services/serverError";

export async function validateRelationships(planoId: string, personalId: string) {
  const [planoExists, personalExists] = await Promise.all([
    prisma.plano.count({ where: { id: planoId } }),
    prisma.personal.count({ where: { id: personalId } })
  ]);

  if (!planoExists) throw new ServerError("Plano não encontrado", 404);
  if (!personalExists) throw new ServerError("Personal trainer não encontrado", 404);
}