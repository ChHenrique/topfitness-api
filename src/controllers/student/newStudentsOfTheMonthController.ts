import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { getPersonalById } from "src/services/database/IPersonalRepository";
import { newStudentsOfTheMonth } from "src/services/database/IStudentRepository";
import { checkAccessWithPersonal } from "src/utils/checkAccess";

export async function newStudentsOfTheMonthController(fastify: fastifyContextDTO) {
    const thisUserIsAuthorized = await checkAccessWithPersonal(fastify, getPersonalById);
    const newStudents = await newStudentsOfTheMonth(thisUserIsAuthorized.id);

    fastify.res.send(newStudents);
}