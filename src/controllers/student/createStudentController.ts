import { fastifyContextDTO } from "../../interfaces/fastifyContextDTO";
import { studentSchema, studentSchemaDTO } from "../../schemas/studentSchema";
import { createStudent } from "../../services/database/IStudentRepository";
import { normalizeMultipartBody } from "../../services/normalizeMultipartBody";
import { ServerError } from "../../services/serverError";
import bcrypt from "bcrypt";
import { createUserPhotoMultipart } from "../../utils/photoMultipart";
import { typeUploads } from "../../types/typeUploads";
import { getPlan } from "../../services/database/IPlanRepository";
import { calculateValidity } from "../../utils/calculateValidity";
import { verifyEmailOrPhoneExist } from "../../utils/verifyEmailOrPhoneExist";
import { getUserById } from "../../services/database/IUserRepository";
import { getPersonalByEmail } from "../../services/database/IPersonalRepository";

export async function createStudentController(fastify: fastifyContextDTO) {
    const user = fastify.req.user;

    if (!user) throw new ServerError("Usuário não autenticado", 401);
    if (user.role !== "ADMINISTRADOR" && user.role !== "PERSONAL") throw new ServerError("Acesso negado", 403);

    const rawData = fastify.req.body as studentSchemaDTO;
    const data = normalizeMultipartBody(rawData);

    if (user.role === "PERSONAL"){ 
        const userPersonal = await getUserById(user.id);
        if (!userPersonal) throw new ServerError("User não encontrando", 404)
        const personal = await getPersonalByEmail(userPersonal.email || "")
        if (!personal) throw new ServerError("Personal não encontrado", 404);
        data.personalId = personal.id
    }

    const parsedData = studentSchema.safeParse(data);
    console.log(parsedData.error)
    if (!parsedData.success) throw new ServerError("Dados inválidos");

    await verifyEmailOrPhoneExist(parsedData)
    if (!parsedData.data.email && !parsedData.data.telefone) throw new ServerError("Email ou telefone é obrigatório", 400);

    const plan = await getPlan(parsedData.data.plano_id)
    if (!plan) throw new ServerError("Plano não encontrado", 404);

    const hashedPassword = await bcrypt.hash(parsedData.data.senha, 10);
    parsedData.data.senha = hashedPassword;

    await createUserPhotoMultipart(rawData, parsedData, typeUploads.ALUNO);
    const validityPlan = calculateValidity(plan.duracaoMeses, parsedData.data.data_matricula || '')

    const student = await createStudent(parsedData.data, validityPlan);
    const { senha, ...rest } = student;

    fastify.res.status(201).send({
        message: "Aluno criado com sucesso",
        student: rest,
    });
}