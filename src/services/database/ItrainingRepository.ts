import { prisma } from "src/config/prisma";
import { TrainingSchemaDTO } from "src/schemas/trainingSchema";

export async function getAllTrainings() {
    const trainings = await prisma.treino.findMany({
        include: { exercicios: true, alunos: true },
    });
    return trainings;
}

export async function getTrainingById(id: string) {
    const training = await prisma.treino.findUnique({
        where: { id },
        include: { exercicios: true, alunos: true },
    });
    return training;
}

export async function createTraining(data: TrainingSchemaDTO & { criador_id: string }) {
    const training = await prisma.treino.create({
        data: { ...data }
    });
    return training;
}

export async function updateTraining(id: string, data: Partial<TrainingSchemaDTO>) {
    const training = await prisma.treino.update({
        where: { id },
        data: { ...data }
    });
    return training;
}

export async function deleteTraining(id: string) {
    const training = await prisma.treino.delete({
        where: { id }
    });
    return training;
}

