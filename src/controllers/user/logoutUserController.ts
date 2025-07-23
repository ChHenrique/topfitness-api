import { FastifyReply, FastifyRequest } from "fastify";
import { deleteAuthCookie } from "src/services/authService";

export async function logoutUserController(req: FastifyRequest, res: FastifyReply) {
    deleteAuthCookie(req, res);
    return res.status(200).send({ message: "Logout realizado com sucesso" });
}