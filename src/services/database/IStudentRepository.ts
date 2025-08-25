import { Prisma, Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { studentSchemaDTO } from "../../schemas/studentSchema";
import { getStartAndEndOfCurrentMonth } from "../../utils/getStartAndEndOfCurrentMonth";
import { ServerError } from "../serverError";
import { validateRelationships } from "../../utils/validateRelationships";

export async function createStudent(data: studentSchemaDTO, dateValidity: Date) {
    const { plano_id, personalId, ...rest } = data;

    await validateRelationships(plano_id, personalId);

    const usuario = await prisma.usuario.create({
        data: {
            email: data.email,
            telefone: data.telefone,
            senha: data.senha,
            role: Role.ALUNO,
        },
    });

    return await prisma.aluno.create({
        data: {
            usuario: { connect: { id: usuario.id } },
            email: data.email,
            telefone: data.telefone,
            role: Role.ALUNO,
            ...rest,
            plano: { connect: { id: plano_id } },
            ...(personalId && { personal: { connect: { id: personalId } } }),
            data_validade_plano: dateValidity,
        },
    });
}

export async function updateStudent(id: string, data: Partial<studentSchemaDTO> & { adicionarDiasValidade?: number }) {
    const student = await prisma.aluno.findUnique({
        where: { id },
        include: { usuario: true, plano: true }
    });

    if (!student || !student.usuario) throw new ServerError("Aluno não encontrado", 404);

    const { plano_id, personalId, adicionarDiasValidade, ...updateData } = data;

    const alunoUpdateData: Prisma.AlunoUpdateInput = {
        ...(data.email && { email: data.email }),
        ...(data.telefone && { telefone: data.telefone }),
        ...(data.senha && { senha: data.senha }),
        ...updateData
    };

    if (plano_id) alunoUpdateData.plano = { connect: { id: plano_id } };
    if (personalId) alunoUpdateData.personal = { connect: { id: personalId } };

    // Atualizar data_validade_plano
    if (adicionarDiasValidade) {
        const agora = new Date();
        let novaDataValidade = student.data_validade_plano;

        // Se já venceu, começa a contar do dia atual
        if (student.data_validade_plano < agora) {
            novaDataValidade = agora;
        }

        novaDataValidade.setDate(novaDataValidade.getDate() + adicionarDiasValidade);
        alunoUpdateData.data_validade_plano = novaDataValidade;
    }

    return await prisma.$transaction(async (tx) => {
        // Atualiza usuário
        await tx.usuario.update({
            where: { id: student.usuario.id },
            data: {
                ...(data.email && { email: data.email }),
                ...(data.telefone && { telefone: data.telefone }),
                ...(data.senha && { senha: data.senha }),
            }
        });

        // Atualiza aluno
        return await tx.aluno.update({
            where: { id },
            data: alunoUpdateData
        });
    });
}


export async function getStudentById(id: string) {
    const student = await prisma.aluno.findUnique({
        where: { id },
        include: {
            personal: true,
            treinos_aluno: {
                include: {
                    treino: {
                        include: {
                            exercicios: true
                        }
                    }
                }
            }
        }
    });

    return student;
};


export async function deleteStudent(userId: string, id: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Deletar aluno
    const student = await tx.aluno.delete({
      where: { id },
    });

    // 2. Deletar usuário
    await tx.usuario.delete({
      where: { id: userId },
    });

    return student;
  });
}

export async function getAllStudents() {
    const students = await prisma.aluno.findMany({
        include: {
            treinos_aluno: {
                include: {
                    treino: {
                        include: {
                            exercicios: true
                        }
                    }
                }
            },
            personal: true
        }
    }
    );

    return students;
};

export async function getStudentByEmail(email: string) {
    const student = await prisma.aluno.findUnique({
        where: { email },
        include: {
            treinos_aluno: {
                include: {
                    treino: {
                        include: {
                            exercicios: true
                        }
                    }
                }
            }
        }
    });

    return student;
};

export async function getStudentByPhone(telefone: string) {
    const student = await prisma.aluno.findUnique({
        where: { telefone },
        include: {
            treinos_aluno: {
                include: {
                    treino: {
                        include: {
                            exercicios: true
                        }
                    }
                }
            }
        }
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
    const { start, end } = getStartAndEndOfCurrentMonth();

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

export async function NewStudentsOfTheMonth() {
    const { start, end } = getStartAndEndOfCurrentMonth();

    const newStudents = await prisma.aluno.findMany({
        where: {
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

export async function updateValidity(id: string, date: Date) {
    const student = await prisma.aluno.update({
        where: { id },
        data: {
            data_validade_plano: date
        }
    });

    return student;
}

export async function notifyMonthlyFee(today: Date, threeDaysAgo: Date) {
    const students = await prisma.aluno.findMany({
        where: {
            data_validade_plano: {
                gte: threeDaysAgo,
                lte: today
            }
        }
    })

    return students;
}

export async function linkPersonalToStudent(idStudent: string, personal_id: string){
    const link = await prisma.aluno.update({
        where: { id: idStudent},
        data: { personal_id: personal_id}
    })

    return link
}

export async function unlinkPersonalToStudent(idStudent: string, personal_id: string){
    const link = await prisma.aluno.update({
        where: { id: idStudent},
        data: { personal_id: null}
    })

    return link
}
