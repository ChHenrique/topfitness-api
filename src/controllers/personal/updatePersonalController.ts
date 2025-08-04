import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { personalSchema, PersonalSchemaDTO } from "src/schemas/personalSchema";
import { getPersonalByEmail, getPersonalById, updatePersonal } from "src/services/database/IPersonalRepository";
import { normalizeMultipartBody } from "src/services/normalizeMultipartBody";
import { ServerError } from "src/services/serverError";
import { typeUploads } from "src/types/typeUploads";
import { checkAccess } from "src/utils/checkAccess";
import { updateUserPhotoMultipart } from "src/utils/photoMultipart";
import { updatedFields } from "src/utils/updateFields";
import { verifyEmailOrPhoneExistUpdate } from "src/utils/verifyEmailOrPhoneExist";
import bcrypt from "bcrypt";
import { getUserById } from "src/services/database/IUserRepository";


export async function updatePersonalController(fastify: fastifyContextDTO) {
    let isAuthorized

    const isAuthorized1 = await checkAccess(fastify, getUserById);
    isAuthorized = isAuthorized1
    
    if ( !isAuthorized1) {
    const isAuthorized2 = await checkAccess(fastify, getPersonalById);
    isAuthorized = isAuthorized2

    }
    

    
    const isPersonal = await getPersonalByEmail(isAuthorized.email)
    if (!isPersonal) throw new ServerError("Personal não encontrado")
        
    const rawData = fastify.req.body as PersonalSchemaDTO;
    const data = normalizeMultipartBody(rawData);

    const parsedData = personalSchema.partial().safeParse(data);
    if (!parsedData.success) throw new ServerError("Dados inválidos");

    await verifyEmailOrPhoneExistUpdate(parsedData, isPersonal)
    await updateUserPhotoMultipart(rawData, parsedData, typeUploads.PERSONAL);

    updatedFields(isPersonal, parsedData.data);
    if (parsedData.data.senha) parsedData.data.senha = await bcrypt.hash(parsedData.data.senha, 10);
    await updatePersonal(isPersonal.id, parsedData.data);

    fastify.res.status(200).send({ message: "Personal atualizado com sucesso" });
}