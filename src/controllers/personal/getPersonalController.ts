import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { getPersonalById } from "src/services/database/IPersonalRepository";
import { ServerError } from "src/services/serverError";
import { checkAccess } from "src/utils/checkAccess";

export async function getPersonalController(fastify: fastifyContextDTO){
    const isPersonal = await checkAccess(fastify, getPersonalById);
    if (!isPersonal) throw new ServerError("Personal não encontrado", 404);

    const { senha, role, ...rest } = isPersonal;
    fastify.res.status(200).send(rest);
}