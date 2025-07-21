import { prisma } from "src/config/prisma";
import { studentSchemaDTO } from "src/schemas/studentSchema";
import { getStartAndEndOfCurrentMonth } from "src/utils/getStartAndEndOfCurrentMonth";

export async function createStudent(data: studentSchemaDTO, dateValidity: Date) {
    const { personalId, planoId, ...rest } = data;

    const student = await prisma.aluno.create({
        data: {
            ...rest,
            plano: {
                connect: { id: planoId }
            }
            ,
            personal: {
                connect: { id: personalId }
            },
            data_validade_plano: dateValidity
        },
    });

    return student;
}



export async function updateStudent(id: string, data: Partial<studentSchemaDTO>) {
    const student = await prisma.aluno.update({
        where: { id },
        data: {
            ...data,
            ...(data.planoId && {
            plano: {
                connect: { id: data.planoId }
            },
            ...(data.personalId && {
                personal: {
                connect: { id: data.personalId }
            },
            })
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


export async function overdueStudentsByPersonal(idPersonal: string) {
    const students = await prisma.aluno.findMany({
        where: {
            personal_id: idPersonal,
            data_validade_plano: {
                lt: new Date()
            }
        },
        include: {
            plano: true
        }
    })

    return students
}

export async function overdueStudents() {
    const students = await prisma.aluno.findMany({
        where: {
            data_validade_plano: {
                lt: new Date()
            }
        },
        include: {
            plano: true
        }
    });

    return students;
};

export async function newStudentsOfTheMonth(personal_id: string) {
    const {start, end } = getStartAndEndOfCurrentMonth();

    const newStudents = await prisma.aluno.findMany({
        where: {
            personal_id,
            criado_em: {
                gte: start,
                lte: end
            }
        }, include: {
            plano: true
        }
    })

    return newStudents;
}

export async function updateValidity(id: string, date: Date){
    const student = await prisma.aluno.update({
        where: { id },
        data: {
            data_validade_plano: date
        }
    });
    
    return student;
}