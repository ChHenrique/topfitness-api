import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { deletePersonal, getPersonalById } from "src/services/database/IPersonalRepository";
import { checkAccess } from "src/utils/checkAccess";

export async function deletePersonalController(fastify: fastifyContextDTO){
    const isPersonal = await checkAccess(fastify, getPersonalById); 
    
    await deletePersonal(isPersonal.id);
    fastify.res.status(200).send({ message: "Personal deletado com sucesso" });
}