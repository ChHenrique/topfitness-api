import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { deletePersonal, getPersonalByEmail, getPersonalById } from "src/services/database/IPersonalRepository";
import { getUserById } from "src/services/database/IUserRepository";
import { ServerError } from "src/services/serverError";
import { checkAccess } from "src/utils/checkAccess";

export async function deletePersonalController(fastify: fastifyContextDTO){
    const isPersonal = await checkAccess(fastify, getUserById);
     
    const personal = await getPersonalByEmail(isPersonal.email)
    if (!personal) throw new ServerError("Personal não encontrado", 404)

    await deletePersonal(personal.usuario_id, personal.id);
    fastify.res.status(200).send({ message: "Personal deletado com sucesso" });
}