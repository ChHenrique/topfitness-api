import { prisma } from "src/config/prisma";
import { PersonalSchemaDTO } from "src/schemas/personalSchema";

export async function createPersonal(data: PersonalSchemaDTO){
    const personal = await prisma.personal.create({
        data: {...data},
    });

    return personal;
};

export async function getPersonalByEmail(email: string) {
    const personal = await prisma.personal.findUnique({
        where: { email },
        include: {
            alunos: true,
            treinos_criados: true
        }
    });

    return personal;
};

export async function getPersonalById(id: string) {
    const personal = await prisma.personal.findUnique({
        where: { id },
    });

    return personal;
};

export async function getAllPersonals() {
    const personals = await prisma.personal.findMany();

    return personals;
};

export async function updatePersonal(id: string, data: Partial<PersonalSchemaDTO>) {
    const {senha, ...rest} = data;
    const updatedPersonal = await prisma.personal.update({
        where: { id },
        data: rest
    });

    return updatedPersonal;
};

export async function deletePersonal(id: string) {
    const deletedPersonal = await prisma.personal.delete({
        where: { id },
    });

    return deletedPersonal;
};

export async function getPersonalByPhone(phone: string) {
    const personal = await prisma.personal.findUnique({
        where: { telefone: phone },
    });

    return personal;
}