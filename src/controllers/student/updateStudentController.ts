import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { studentSchema, studentSchemaDTO } from "src/schemas/studentSchema";
import { getStudentByEmail, getStudentById, getStudentByPhone, updateStudent } from "src/services/database/IStudentRepository";
import { normalizeMultipartBody } from "src/services/normalizeMultipartBody";
import { ServerError } from "src/services/serverError";
import { typeUploads } from "src/types/typeUploads";
import { checkAccess } from "src/utils/checkAccess";
import { updateUserPhotoMultipart } from "src/utils/photoMultipart";
import { updatedFields } from "src/utils/updateFields";

export async function updateStudentController(fastify: fastifyContextDTO){
    const isUserExist = await checkAccess(fastify, getStudentById);
    
    const rawData = fastify.req.body as studentSchemaDTO;
    const data = normalizeMultipartBody(rawData);

    const parsedData = studentSchema.partial().safeParse(data);
    if (!parsedData.success) {
        console.log("erro: ", parsedData.error.format);
        throw new ServerError("Dados inválidos");
    }

    if (parsedData.data.email && parsedData.data.email !== isUserExist.email) {
        const isEmailExist = await getStudentByEmail(parsedData.data.email);
        if (isEmailExist) throw new ServerError("Email já cadastrado", 409);
    };

    if (parsedData.data.telefone && parsedData.data.telefone !== isUserExist.telefone) {
        const isPhoneExist = await getStudentByPhone(parsedData.data.telefone);
        if (isPhoneExist) throw new ServerError("Telefone já cadastrado", 409);
    };

    await updateUserPhotoMultipart(rawData, parsedData, typeUploads.ALUNO);

    updatedFields(isUserExist, parsedData.data);
    const test = await updateStudent(isUserExist.id, parsedData.data);

    fastify.res.status(200).send({ message: "Aluno atualizado com sucesso", student: test });
}