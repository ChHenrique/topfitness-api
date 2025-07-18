import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { adminSchema, AdminSchemaDTO } from "src/schemas/adminSchema";
import { getAdminByEmail, getAdminById, getAdminByPhone, updateAdmin } from "src/services/database/IAdminRepository";
import { ServerError } from "src/services/serverError";
import { photoStorageService } from "src/services/photoStorageService";
import { updatedFields } from "src/utils/updateFields";
import { typeUploads } from "src/types/typeUploads";
import { normalizeMultipartBody } from "src/services/normalizeMultipartBody";

export async function updateAdminController(fastify: fastifyContextDTO) {
    const user = fastify.req.user;
    
    if (!user) throw new ServerError("Usuário não autenticado", 401);
    if (user.role !== "ADMINISTRADOR") throw new ServerError("Acesso negado", 403);

    const rawData = fastify.req.body as AdminSchemaDTO;
    const data = normalizeMultipartBody(rawData);

    const parsedData = adminSchema.partial().safeParse(data);
    if (!parsedData.success) throw new ServerError("Dados inválidos");

    const isAdminExist = await getAdminById(user.id);
    if (!isAdminExist) throw new ServerError("Administrador não encontrado", 404);

    if (parsedData.data.email !== isAdminExist.email) {
        const isEmailExist = await getAdminByEmail(parsedData.data.email ?? '');
        if (isEmailExist) throw new ServerError("Email já cadastrado", 409);
    };

    if (parsedData.data.telefone !== isAdminExist.telefone) {
        const isPhoneExist = await getAdminByPhone(parsedData.data.telefone ?? '');
        if (isPhoneExist) throw new ServerError("Telefone já cadastrado", 409);
    };

    updatedFields(isAdminExist, parsedData.data);
    const foto = rawData.foto;
    if (foto && typeof foto.toBuffer === 'function') {
        const buffer = await foto.toBuffer();
        const { filename, mimetype } = foto;
        parsedData.data.foto = await photoStorageService({ buffer, filename, mimetype }, typeUploads.ADMINISTRADOR);
    }

    const updatedAdmin = await updateAdmin(isAdminExist.id, parsedData.data);
    fastify.res.status(200).send({
        message: "Administrador atualizado com sucesso",
        admin: updatedAdmin,
    });
}