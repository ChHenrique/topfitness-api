import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { studentSchema, studentSchemaDTO } from "src/schemas/studentSchema";
import { createStudent } from "src/services/database/IStudentRepository";
import { normalizeMultipartBody } from "src/services/normalizeMultipartBody";
import { ServerError } from "src/services/serverError";
import bcrypt from "bcrypt";
import { createUserPhotoMultipart } from "src/utils/photoMultipart";
import { typeUploads } from "src/types/typeUploads";
import { getPlan } from "src/services/database/IPlanRepository";
import { calculateValidity } from "src/utils/calculateValidity";
import { verifyEmailOrPhoneExist } from "src/utils/verifyEmailOrPhoneExist";
import { getUserById } from "src/services/database/IUserRepository";
import { getPersonalByEmail } from "src/services/database/IPersonalRepository";

export async function createStudentController(fastify: fastifyContextDTO) {
    const user = fastify.req.user;

    if (!user) throw new ServerError("Usuário não autenticado", 401);
    if (user.role !== "ADMINISTRADOR" && user.role !== "PERSONAL") throw new ServerError("Acesso negado", 403);

    const rawData = fastify.req.body as studentSchemaDTO;
    const data = normalizeMultipartBody(rawData);

    if (user.role === "PERSONAL"){ 
        const userPersonal = await getUserById(user.id);
        if (!userPersonal) throw new ServerError("User não encontrando", 404)
        console.log("USERPERSONAL: ", userPersonal)
        const personal = await getPersonalByEmail(userPersonal.email || "")
        if (!personal) throw new ServerError("Personal não encontrado", 404);
        console.log("personal: ", personal)
        data.personalId = personal.id
        console.log(data.personal_id)
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
    const validityPlan = calculateValidity(plan.duracaoMeses)

    const student = await createStudent(parsedData.data, validityPlan);
    const { senha, ...rest } = student;

    fastify.res.status(201).send({
        message: "Aluno criado com sucesso",
        student: rest,
    });
}