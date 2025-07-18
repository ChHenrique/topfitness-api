import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { deleteAdmin, getAdminById } from "src/services/database/IAdminRepository";
import { ServerError } from "src/services/serverError";

export async function deleteAdminController(fastify: fastifyContextDTO){
    const user = fastify.req.user;

    if (!user) throw new ServerError("Usuário não autenticado", 401);
    if (user.role !== "ADMINISTRADOR") throw new ServerError("Acesso negado", 403);

    const { id } = fastify.req.params as { id: string };

    const isAdminExist = await getAdminById(id);
    if (!isAdminExist) throw new ServerError("Administrador não encontrado", 404);

    await deleteAdmin(id);
    fastify.res.status(200).send({ message: "Administrador deletado com sucesso" });
}