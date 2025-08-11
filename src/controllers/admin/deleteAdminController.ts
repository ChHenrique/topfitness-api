import { fastifyContextDTO } from "../../interfaces/fastifyContextDTO";
import { deleteAdmin, getAdminByEmail, getAdminById } from "../../services/database/IAdminRepository";

import { ServerError } from "../../services/serverError";
import { checkAccess } from "../../utils/checkAccess";

export async function deleteAdminController(fastify: fastifyContextDTO){
    const isAdminExist = await checkAccess(fastify, getAdminById);

    const admin = await getAdminByEmail(isAdminExist.email);
    if (!admin) throw new ServerError("Admin não encontrado", 404)
    
    await deleteAdmin(isAdminExist.id);
    fastify.res.status(200).send({ message: "Administrador deletado com sucesso" });
}