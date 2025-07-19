import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { deleteStudent, getStudentById } from "src/services/database/IStudentRepository";
import { checkAccessWithPersonal } from "src/utils/checkAccess";

export async function deleteStudentController(fastify: fastifyContextDTO) {
    const isStudent = await checkAccessWithPersonal(fastify, getStudentById);

    await deleteStudent(isStudent.id);
    fastify.res.status(200).send({ message: "Aluno deletado com sucesso" });
}