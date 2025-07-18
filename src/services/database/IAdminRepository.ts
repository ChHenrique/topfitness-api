import { prisma } from "src/config/prisma";
import { AdminSchemaDTO } from "src/schemas/adminSchema";
import { Role } from "@prisma/client";

export async function createAdmin(Admin: AdminSchemaDTO){
    const admin = await prisma.administrador.create({
        data: {...Admin, role: Role.ADMINISTRADOR},
    });

    return admin;
};

export async function getAdminByEmail(email: string) {
    const admin = await prisma.administrador.findUnique({
        where: { email },
    });

    return admin;
};

export async function getAdminById(id: string) {
    const admin = await prisma.administrador.findUnique({
        where: { id },
    });

    return admin;
};

export async function getAllAdmins() {
    const admins = await prisma.administrador.findMany();

    return admins;
};

export async function updateAdmin(id: string, data: Partial<AdminSchemaDTO>) {
    const { senha, ...rest } = data;
    const updatedAdmin = await prisma.administrador.update({
        where: { id },
        data: {...rest}
    });

    return updatedAdmin;
};

export async function deleteAdmin(id: string) {
    const deletedAdmin = await prisma.administrador.delete({
        where: { id },
    });

    return deletedAdmin;
};

export async function getAdminByPhone(phone: string) {
    const admin = await prisma.administrador.findUnique({
        where: { telefone: phone },
    });

    return admin;
}

