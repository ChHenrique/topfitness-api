import { prisma } from "src/config/prisma";
import { studentSchemaDTO } from "src/schemas/studentSchema";

export async function createStudent(data: studentSchemaDTO) {
    const student = await prisma.aluno.create({
        data: {
            ...data, ...(data.planoId && {
                plano: {
                    connect: { id: data.planoId }
                }
            })
        },
    })

    return student;
};

export async function updateStudent(id: string, data: Partial<studentSchemaDTO>) {
    const student = await prisma.aluno.update({
        where: { id },
        data: {
            ...data,
            ...(data.planoId && {
                plano: {
                    connect: { id: data.planoId }
                }
            })
        },
    });

    return student;
};

export async function getStudentById(id: string) {
    const student = await prisma.aluno.findUnique({
        where: { id },
    });

    return student;
};

export async function deleteStudent(id: string) {
    const student = await prisma.aluno.delete({
        where: { id },
    });

    return student;
};

export async function getAllStudents() {
    const students = await prisma.aluno.findMany();

    return students;
};

export async function getStudentByEmail(email: string) {
    const student = await prisma.aluno.findUnique({
        where: { email },
    });

    return student;
};

export async function getStudentByPhone(telefone: string) {
    const student = await prisma.aluno.findUnique({
        where: { telefone },
    });

    return student;
};
