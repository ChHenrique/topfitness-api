import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { getAdminById } from "src/services/database/IAdminRepository";
import { ServerError } from "src/services/serverError";

export async function getAdminController(fastify: fastifyContextDTO){
    const user = fastify.req.user;

    if (!user) throw new ServerError("Usuário não autenticado", 401);
    if (user.role !== "ADMINISTRADOR") throw new ServerError("Acesso negado", 403);

    const isAdminExist = await getAdminById(user.id);
    if (!isAdminExist) throw new ServerError("Administrador não encontrado", 404);

    if (isAdminExist.email !== user.email) throw new ServerError("Email não corresponde ao usuário autenticado", 403);

    const { senha, role, ...rest } = isAdminExist;
    fastify.res.status(200).send(rest);
}