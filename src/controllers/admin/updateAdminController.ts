import { fastifyContextDTO } from "../../interfaces/fastifyContextDTO";
import { adminSchema, AdminSchemaDTO } from "../../schemas/adminSchema";
import { getAdminById, updateAdmin } from "../../services/database/IAdminRepository";
import { ServerError } from "../../services/serverError";
import { updatedFields } from "../../utils/updateFields";
import { typeUploads } from "../../types/typeUploads";
import { normalizeMultipartBody } from "../../services/normalizeMultipartBody";
import { updateUserPhotoMultipart } from "../../utils/photoMultipart";
import { verifyEmailOrPhoneExistUpdate } from "../../utils/verifyEmailOrPhoneExist";
import bcrypt from "bcrypt";
import { getUserById } from "../../services/database/IUserRepository";

export async function updateAdminController(fastify: fastifyContextDTO) {
    const user = fastify.req.user;
    
    if (!user) throw new ServerError("Usuário não autenticado", 401);
    if (user.role !== "ADMINISTRADOR") throw new ServerError("Acesso negado", 403);

    const rawData = fastify.req.body as AdminSchemaDTO;
    const data = normalizeMultipartBody(rawData);

    const parsedData = adminSchema.partial().safeParse(data);
    if (!parsedData.success) {
  console.error("Erro de validação Zod:", parsedData.error.format());
  console.log("Dados recebidos:", data);
  throw new ServerError("Dados inválidos");
}

    const isAdminExist = await getUserById(user.id);
    if (!isAdminExist) throw new ServerError("Administrador não encontrado", 404);
    const admin = isAdminExist?.administrador
     if (!admin) throw new ServerError("Administrador não encontrado", 404);

    await verifyEmailOrPhoneExistUpdate(parsedData, admin)
    await updateUserPhotoMultipart(rawData, parsedData, typeUploads.ADMINISTRADOR);

    updatedFields(admin, parsedData.data);
    if (parsedData.data.senha) parsedData.data.senha = await bcrypt.hash(parsedData.data.senha, 10);
    
    await updateAdmin(admin.id, parsedData.data);
    fastify.res.status(200).send({ message: "Administrador atualizado com sucesso" });
}