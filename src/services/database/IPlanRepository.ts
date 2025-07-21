import { prisma } from "src/config/prisma";

export async function getPlan(id: string){
    const plan = await prisma.plano.findUnique({
        where: {id}
    });

    return plan;
};