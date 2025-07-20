import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { adminSchema, AdminSchemaDTO } from "src/schemas/adminSchema";
import { createAdmin, getAdminByEmail, getAdminByPhone } from "src/services/database/IAdminRepository";
import { ServerError } from "src/services/serverError";
import bcrypt from "bcrypt";
import { photoStorageService } from "src/services/photoStorageService";
import { typeUploads } from "src/types/typeUploads";
import { normalizeMultipartBody } from "src/services/normalizeMultipartBody";
import { createUserPhotoMultipart } from "src/utils/photoMultipart";

export async function createAdminController(fastify: fastifyContextDTO) {
    const user = fastify.req.user;

    if (!user) throw new ServerError("Usuário não autenticado", 401);
    if (user.role !== "ADMINISTRADOR") throw new ServerError("Acesso negado", 403);

    const rawData = fastify.req.body as AdminSchemaDTO;
    const data = normalizeMultipartBody(rawData);

    const parsedData = adminSchema.safeParse(data);
    if (!parsedData.success) {
        console.log("Erro de validação Zod:", parsedData.error.format);
        throw new ServerError("Dados inválidos");
    }

    const isEmailExist = await getAdminByEmail(parsedData.data.email);
    if (isEmailExist) throw new ServerError("Email já cadastrado", 409);

    const isPhoneExist = await getAdminByPhone(parsedData.data.telefone);
    if (isPhoneExist) throw new ServerError("Telefone já cadastrado", 409);

    const hashedPassword = await bcrypt.hash(parsedData.data.senha, 10);
    parsedData.data.senha = hashedPassword;

    await createUserPhotoMultipart(rawData, parsedData, typeUploads.ADMINISTRADOR);

    await createAdmin(parsedData.data);
    fastify.res.status(201).send({message: "Administrador criado com sucesso"});
};
