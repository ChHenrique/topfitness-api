export interface userDTO {
    role: "ALUNO" | "PERSONAL" | "ADMIN";
    id: string;
    email: string;
}

declare module "fastify" {
    interface FastifyRequest {
        user?: userDTO;
    }
}