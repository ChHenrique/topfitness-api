import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { studentSchema, studentSchemaDTO } from "src/schemas/studentSchema";
import { getStudentById, updateStudent } from "src/services/database/IStudentRepository";
import { getUserByEmail, getUserByPhone } from "src/services/database/IUserRepository";
import { normalizeMultipartBody } from "src/services/normalizeMultipartBody";
import { ServerError } from "src/services/serverError";
import { typeUploads } from "src/types/typeUploads";
import { checkAccess } from "src/utils/checkAccess";
import { updateUserPhotoMultipart } from "src/utils/photoMultipart";
import { updatedFields } from "src/utils/updateFields";
import { verifyEmailOrPhoneExist } from "src/utils/verifyEmailOrPhoneExist";

export async function updateStudentController(fastify: fastifyContextDTO){
    const isUserExist = await checkAccess(fastify, getStudentById);
    
    const rawData = fastify.req.body as studentSchemaDTO;
    const data = normalizeMultipartBody(rawData);

    const parsedData = studentSchema.partial().safeParse(data);
    if (!parsedData.success) throw new ServerError("Dados inválidos");

    await verifyEmailOrPhoneExist(parsedData)
    await updateUserPhotoMultipart(rawData, parsedData, typeUploads.ALUNO);

    updatedFields(isUserExist, parsedData.data);
    const test = await updateStudent(isUserExist.id, parsedData.data);

    fastify.res.status(200).send({ message: "Aluno atualizado com sucesso", student: test });
}