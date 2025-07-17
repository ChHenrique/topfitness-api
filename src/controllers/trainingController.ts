import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { trainingSchema, TrainingSchemaDTO } from "src/schemas/trainingSchema";
import { photoStorageService } from "src/services/photoStorageService";
import { ServerError } from "src/services/serverError";


export async function createTrainingController(fastify: fastifyContextDTO) {
    const user = fastify.req.user;

    if (!user) throw new ServerError("Usuário não autenticado", 401);
    if (user.role == "ALUNO") throw new ServerError("Acesso negado", 403);

    const data = fastify.req.body as TrainingSchemaDTO;
    const parsed = trainingSchema.safeParse(data);

    if (!parsed.success) throw new ServerError("Dados inválidos", 400)

    const foto = parsed.data.foto
    if (foto && foto.file) {
        photoStorageService(foto, "treino");
         const buffer = await foto.toBuffer();
            const { filename, mimetype } = foto;
            let urlFoto = await photoStorageService({ buffer, filename, mimetype }, type);
    }

}
