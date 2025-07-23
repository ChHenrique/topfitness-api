import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { personalSchema, PersonalSchemaDTO } from "src/schemas/personalSchema";
import { getPersonalById, updatePersonal } from "src/services/database/IPersonalRepository";
import { getUserByEmail, getUserByPhone } from "src/services/database/IUserRepository";
import { normalizeMultipartBody } from "src/services/normalizeMultipartBody";
import { ServerError } from "src/services/serverError";
import { typeUploads } from "src/types/typeUploads";
import { checkAccess } from "src/utils/checkAccess";
import { updateUserPhotoMultipart } from "src/utils/photoMultipart";
import { updatedFields } from "src/utils/updateFields";
import { verifyEmailOrPhoneExist } from "src/utils/verifyEmailOrPhoneExist";

export async function updatePersonalController(fastify: fastifyContextDTO) {
    const isPersonal = await checkAccess(fastify, getPersonalById);

    const rawData = fastify.req.body as PersonalSchemaDTO;
    const data = normalizeMultipartBody(rawData);

    const parsedData = personalSchema.partial().safeParse(data);
    if (!parsedData.success) throw new ServerError("Dados inválidos");

    await verifyEmailOrPhoneExist(parsedData)
    await updateUserPhotoMultipart(rawData, parsedData, typeUploads.PERSONAL);

    updatedFields(isPersonal, parsedData.data);
    await updatePersonal(isPersonal.id, parsedData.data);

    fastify.res.status(200).send({ message: "Personal atualizado com sucesso" });
}