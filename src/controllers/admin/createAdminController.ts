import { fastifyContextDTO } from "../../interfaces/fastifyContextDTO";
import { adminSchema, AdminSchemaDTO } from "../../schemas/adminSchema";
import { createAdmin } from "../../services/database/IAdminRepository";
import { ServerError } from "../../services/serverError";
import bcrypt from "bcrypt";

import { typeUploads } from "../../types/typeUploads";
import { normalizeMultipartBody } from "../../services/normalizeMultipartBody";
import { createUserPhotoMultipart } from "../../utils/photoMultipart";
import { verifyEmailOrPhoneExist } from "../../utils/verifyEmailOrPhoneExist";

export async function createAdminController(fastify: fastifyContextDTO) {
    const user = fastify.req.user;
    if (!user) throw new ServerError("Usuário não autenticado", 401);

    if (user.role !== "ADMINISTRADOR") throw new ServerError("Acesso negado", 403);
    
    const rawData = fastify.req.body as AdminSchemaDTO;
    const data = normalizeMultipartBody(rawData);

    const parsedData = adminSchema.safeParse(data);
    if (!parsedData.success) throw new ServerError("Dados inválidos");

    await verifyEmailOrPhoneExist(parsedData)

    const hashedPassword = await bcrypt.hash(parsedData.data.senha, 10);
    parsedData.data.senha = hashedPassword;

    await createUserPhotoMultipart(rawData, parsedData, typeUploads.ADMINISTRADOR);

    await createAdmin(parsedData.data);
    fastify.res.status(201).send({message: "Administrador criado com sucesso"});
};
