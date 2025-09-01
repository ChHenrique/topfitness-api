import { FastifyInstance } from "fastify";
import { loginUserController } from "../controllers/auth/loginUser";
import { logOutUserController } from "../controllers/auth/logoutUser";
import { authMiddleware } from "../middlewares/authMiddleware";
import { autoLogin } from "../controllers/auth/autoLogin";

export async function authRoutes(fastify: FastifyInstance){
    fastify.post("/login", async (req, res) => await loginUserController({req, res}))
    fastify.delete("/logout", { preHandler: authMiddleware}, async (req, res) => await logOutUserController({req, res}))
    fastify.get("/auto-login", { preHandler: autoLogin }, async (req, res) => await autoLogin(req, res))
}