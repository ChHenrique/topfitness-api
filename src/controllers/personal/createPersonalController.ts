import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { personalSchema, PersonalSchemaDTO } from "src/schemas/personalSchema";
import { createPersonal, getPersonalByEmail, getPersonalByPhone } from "src/services/database/IPersonalRepository";
import { normalizeMultipartBody } from "src/services/normalizeMultipartBody";
import { ServerError } from "src/services/serverError";
import bcrypt from "bcrypt";
import { typeUploads } from "src/types/typeUploads";
import { photoStorageService } from "src/services/photoStorageService";

export async function createPersonalController(fastify: fastifyContextDTO) {
    const user = fastify.req.user;

    if (!user) throw new ServerError("Usuário não autenticado", 401);
    if (user.role !== "ADMINISTRADOR") throw new ServerError("Acesso negado", 403);

    const rawData = fastify.req.body as PersonalSchemaDTO;
    const data = normalizeMultipartBody(rawData);

    const parsedData = personalSchema.safeParse(data);
    console.log("Parsed Data:", parsedData.error);
    if (!parsedData.success) throw new ServerError("Dados inválidos", 400);

    if (parsedData.data.email) {
        const isEmailExist = await getPersonalByEmail(parsedData.data.email);
        if (isEmailExist) throw new ServerError("Email já cadastrado", 409);
    }

    if (parsedData.data.telefone) {
        const isPhoneExist = await getPersonalByPhone(parsedData.data.telefone);
        if (isPhoneExist) throw new ServerError("Telefone já cadastrado", 409);
    }

    if (parsedData.data.senha) {
        const hashedPassword = await bcrypt.hash(parsedData.data.senha, 10);
        parsedData.data.senha = hashedPassword;
    }

    const foto = rawData.foto;
    if (foto && typeof foto.toBuffer === 'function') {
        const buffer = await foto.toBuffer();
        const { filename, mimetype } = foto;
        parsedData.data.foto = await photoStorageService({ buffer, filename, mimetype }, typeUploads.PERSONAL);
    } else {
        parsedData.data.foto = null;
    }

    const personal = await createPersonal(parsedData.data);
    fastify.res.status(201).send({
        message: "Personal criado com sucesso",
        personal: personal
    });
}