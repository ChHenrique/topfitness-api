import { fastifyContextDTO } from "../../interfaces/fastifyContextDTO";
import { getPersonalByEmail } from "../../services/database/IPersonalRepository";
import { getStudentById, linkPersonalToStudent, unlinkPersonalToStudent } from "../../services/database/IStudentRepository";
import { getUserById } from "../../services/database/IUserRepository";
import { ServerError } from "../../services/serverError";

export async function linkPersonalToStudentControler(fastify: fastifyContextDTO) {
    const user = fastify.req.user;
    const { idStudent } = fastify.req.params as { idStudent: string };

    if (!user) throw new ServerError("Usuário não autenticado", 401);
    if (user.role === "ALUNO") throw new ServerError("Acesso negado", 403);

    const userPersonal = await getUserById(user.id);
    if (!userPersonal) throw new ServerError("User não encontrado", 404);

    const personal = await getPersonalByEmail(userPersonal.email || "");
    if (!personal) throw new ServerError("Personal não encontrado", 404);

    const student = await getStudentById(idStudent);
    if (!student) throw new ServerError("Aluno não encontrado", 404)

    if (student.personal_id === personal.id) throw new ServerError("Aluno já esta vinculado")
        
    await linkPersonalToStudent(idStudent, personal.id);
    fastify.res.send("Aluno vinculado ao personal com sucesso");
}

export async function unlinkPersonalToStudentControler(fastify: fastifyContextDTO) {
    const user = fastify.req.user;
    const { idStudent } = fastify.req.params as { idStudent: string };

    if (!user) throw new ServerError("Usuário não autenticado", 401);
    if (user.role === "ALUNO") throw new ServerError("Acesso negado", 403);

    const userPersonal = await getUserById(user.id);
    if (!userPersonal) throw new ServerError("User não encontrado", 404);

    const personal = await getPersonalByEmail(userPersonal.email || "");
    if (!personal) throw new ServerError("Personal não encontrado", 404);

    const student = await getStudentById(idStudent);

    await unlinkPersonalToStudent(idStudent, personal.id);
    console.log(student)
    fastify.res.send("Aluno vinculado ao personal com sucesso");
}