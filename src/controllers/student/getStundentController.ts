import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { getStudentById } from "src/services/database/IStudentRepository";
import { checkAccessWithPersonal } from "src/utils/checkAccess";

export async function getStudentController(fastify: fastifyContextDTO) {
    const isStudentExist = await checkAccessWithPersonal(fastify, getStudentById);

    const { senha, role, ...rest } = isStudentExist;
    fastify.res.status(200).send(rest);
}