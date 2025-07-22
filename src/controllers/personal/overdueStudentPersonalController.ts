import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { getPersonalById } from "src/services/database/IPersonalRepository";
import { overdueStudents, overdueStudentsByPersonal } from "src/services/database/IStudentRepository";
import { ServerError } from "src/services/serverError";
import { checkAccessWithPersonal } from "src/utils/checkAccess";

export async function overdueStudentByPersonalController(fastify: fastifyContextDTO){
    const thisUserIsAuthorized = await checkAccessWithPersonal(fastify, getPersonalById);
    
    const overdueStudents = await overdueStudentsByPersonal(thisUserIsAuthorized.id);
    fastify.res.send(overdueStudents);
}


export async function overdueStudentController(fastify: fastifyContextDTO){
    const user = fastify.req.user;
    if (!user) throw new ServerError("Não autenticado", 401);

    if (user.role !== "ADMINISTRADOR") throw new ServerError("Acesso negado", 403);    
    const findManyOverdueStudents = await overdueStudents();

    fastify.res.send(findManyOverdueStudents);
}


