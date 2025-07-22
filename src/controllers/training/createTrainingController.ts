import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { trainingSchema, TrainingSchemaDTO } from "src/schemas/trainingSchema";
import { createTraining } from "src/services/database/ItrainingRepository";
import { normalizeMultipartBody } from "src/services/normalizeMultipartBody";
import { ServerError } from "src/services/serverError";
import { typeUploads } from "src/types/typeUploads";
import { createUserPhotoMultipart } from "src/utils/photoMultipart";

export async function createTrainingController(fastify: fastifyContextDTO) {
    const { user, body } = fastify.req;

    if (!user) throw new ServerError("Usuário não autenticado", 401);
    if (user.role === "ALUNO") throw new ServerError("Acesso negado", 403);

    const data = normalizeMultipartBody(body as TrainingSchemaDTO);
    const parsed = trainingSchema.safeParse(data);

    if (!parsed.success) throw new ServerError("Dados inválidos");

    await createUserPhotoMultipart(body, parsed, typeUploads.TRAINING);

    await createTraining({
        ...parsed.data,
        criador_id: user.id
    });

    fastify.res.status(201).send({ message: "Treino criado com sucesso" });
}
