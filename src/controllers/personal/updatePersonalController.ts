import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { personalSchema, PersonalSchemaDTO } from "src/schemas/personalSchema";
import { getPersonalByEmail, getPersonalById, getPersonalByPhone, updatePersonal } from "src/services/database/IPersonalRepository";
import { normalizeMultipartBody } from "src/services/normalizeMultipartBody";
import { photoStorageService } from "src/services/photoStorageService";
import { ServerError } from "src/services/serverError";
import { typeUploads } from "src/types/typeUploads";
import { checkAccess } from "src/utils/checkAccess";
import { updateUserPhotoMultipart } from "src/utils/photoMultipart";
import { updatedFields } from "src/utils/updateFields";

export async function updatePersonalController(fastify: fastifyContextDTO) {
    const isPersonal = await checkAccess(fastify, getPersonalById);

    const rawData = fastify.req.body as PersonalSchemaDTO;
    const data = normalizeMultipartBody(rawData);

    const parsedData = personalSchema.partial().safeParse(data);
    if (!parsedData.success) throw new ServerError("Dados inválidos");

    if (parsedData.data.email && parsedData.data.email !== isPersonal.email) {
        const isEmailExist = await getPersonalByEmail(parsedData.data.email);
        if (isEmailExist) throw new ServerError("Email já cadastrado", 409);
    };
    
    if (parsedData.data.telefone && parsedData.data.telefone !== isPersonal.telefone) {
        const isPhoneExist = await getPersonalByPhone(parsedData.data.telefone);
        if (isPhoneExist) throw new ServerError("Telefone já cadastrado", 409);
    };

    await updateUserPhotoMultipart(rawData, parsedData, typeUploads.PERSONAL);

    updatedFields(isPersonal, parsedData.data);
    await updatePersonal(isPersonal.id, parsedData.data);

    fastify.res.status(200).send({ message: "Personal atualizado com sucesso" });
}