import { FastifyInstance } from "fastify";
import { loginUserController } from "src/controllers/user/loginUserController";
import { logoutUserController } from "src/controllers/user/logoutUserController";
import { authMiddleware } from "src/middlewares/authMiddleware";

export async function adminRoutes(fastify: FastifyInstance) {
    fastify.post('/user/login', { preHandler: authMiddleware }, async (req, res) => await loginUserController(req, res));
    fastify.delete('/user/logout', { preHandler: authMiddleware }, async (req, res) => await logoutUserController(req, res));
};