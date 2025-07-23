import { prisma } from "src/config/prisma";

export async function getAllUsers() {
    return await prisma.usuario.findMany({
        include: { administrador: true, aluno: true, personal: true },
    });
}

export async function getUserById(id: string) {
    return await prisma.usuario.findUnique({
        where: { id },
        include: { administrador: true, aluno: true, personal: true },
    });
}

export async function getUserByEmail(email: string) {
    return await prisma.usuario.findUnique({
        where: { email },
        include: { administrador: true, aluno: true, personal: true },
    });
}

export async function getUserByPhone(phone: string) {
    return await prisma.usuario.findUnique({
        where: { telefone: phone },
        include: { administrador: true, aluno: true, personal: true },
    });
}

export async  function deleteUser(id: string) {
    return await prisma.usuario.delete({
        where: { id }
    });
}
