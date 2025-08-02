import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { getAdminById } from "src/services/database/IAdminRepository";
import { checkAccess } from "src/utils/checkAccess";

export async function getAdminController(fastify: fastifyContextDTO){
    const isAdminExist = await checkAccess(fastify, getAdminById);

    const { senha, role, ...rest } = isAdminExist;
    fastify.res.status(200).send(rest);
}