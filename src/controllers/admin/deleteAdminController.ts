import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { deleteAdmin, getAdminById } from "src/services/database/IAdminRepository";
import { ServerError } from "src/services/serverError";
import { checkAccess } from "src/utils/checkAccess";

export async function deleteAdminController(fastify: fastifyContextDTO){
    const isAdminExist = await checkAccess(fastify, getAdminById);

    await deleteAdmin(isAdminExist.id);
    fastify.res.status(200).send({ message: "Administrador deletado com sucesso" });
}