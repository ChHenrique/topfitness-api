import { Role } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { PersonalSchemaDTO } from "../../schemas/personalSchema";
import { ServerError } from "../serverError";
import { includes } from "zod";

export async function createPersonal(data: PersonalSchemaDTO){
      const usuario = await prisma.usuario.create({
        data: {
          email: data.email,
          telefone: data.telefone,
          senha: data.senha,
          role: Role.PERSONAL,
        },
      });
    
    const personal = await prisma.personal.create({
        data: { usuario_id: usuario.id, ...data},
    });

    return personal;
};

export async function getPersonalByEmail(email: string) {
  const personal = await prisma.personal.findUnique({
    where: { email },
    include: {
      alunos: {
        include: {
          treinos_aluno: {
            include: {
              treino: true
            }
          }
        }
      },
      treinos_criados: true, // Treinos criados pelo personal
    },
  });

  return personal;
}

export async function getPersonalById(id: string) {
  const personal = await prisma.personal.findUnique({
    where: { id },
    include: {
      alunos: {
        include: {
          treinos_aluno: {
            include: {
              treino: true
            }
          }
        }
      },
      treinos_criados: true,
    },
  });

  return personal;
}

export async function getAllPersonals() {
  const personals = await prisma.personal.findMany({
    include: {
      alunos: {
        include: {
          treinos_aluno: {
            include: {
              treino: true
            }
          }
        }
      },
      treinos_criados: true,
    },
  });

  return personals;
}

export async function updatePersonal(id: string, data: Partial<PersonalSchemaDTO>) {
    const {senha, ...rest} = data;

    const personal = await prisma.personal.findUnique({
        where: { id },
        select: { usuario_id: true },
    });

    if (!personal) throw new ServerError("Personal não encontrado", 404);

    await prisma.usuario.update({
        where: { id: personal.usuario_id },
        data: {
            email: rest.email,
            telefone: rest.telefone,
            senha: senha ? senha : undefined,
        } })

    const updatedPersonal = await prisma.personal.update({
        where: { id },
        data: rest
    });

    return updatedPersonal;
};

export async function deletePersonal(id: string) {
  await prisma.$transaction(async (tx) => {
    // Buscar IDs dos treinos do personal
    const treinos = await tx.treino.findMany({
      where: { criador_id: id },
      select: { id: true },
    });

    const treinoIds = treinos.map((t) => t.id);

    // 1. Deletar treinos realizados (TreinoRealizado) e dias da semana (AlunoTreinoDiaSemana)
    const alunoTreinos = await tx.alunoTreino.findMany({
      where: { treino_id: { in: treinoIds } },
      select: { id: true },
    });

    const alunoTreinoIds = alunoTreinos.map((t) => t.id);

    await tx.treinoRealizado.deleteMany({
      where: { alunoTreinoId: { in: alunoTreinoIds } },
    });

    await tx.alunoTreinoDiaSemana.deleteMany({
      where: { alunoTreinoId: { in: alunoTreinoIds } },
    });

    // 2. Deletar vinculações aluno <-> treino
    await tx.alunoTreino.deleteMany({
      where: { treino_id: { in: treinoIds } },
    });

    // 3. Deletar exercícios
    await tx.exercicio.deleteMany({
      where: { treino_id: { in: treinoIds } },
    });

    // 4. Deletar os treinos
    await tx.treino.deleteMany({
      where: { id: { in: treinoIds } },
    });

    // 5. Desvincular os alunos
    await tx.aluno.updateMany({
      where: { personal_id: id },
      data: { personal_id: null },
    });

    // Buscar o personal antes de deletar
    const personal = await tx.personal.findUnique({
      where: { id },
      select: { usuario_id: true },
    });

    if (!personal) {
      throw new Error("Personal não encontrado");
    }

    // 6. Deletar o personal
    await tx.personal.delete({
      where: { id },
    });

    // 7. Deletar o usuário vinculado
    await tx.usuario.delete({
      where: { id: personal.usuario_id },
    });
  });
}


export async function getPersonalByPhone(phone: string) {
  const personal = await prisma.personal.findUnique({
    where: { telefone: phone },
    include: {
      alunos: {
        include: {
          treinos_aluno: {
            include: {
              treino: true, 
            },
          },
        },
      },
      treinos_criados: true,
    },
  });

  return personal;

}