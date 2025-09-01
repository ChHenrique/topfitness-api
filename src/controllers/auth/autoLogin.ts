import { FastifyReply, FastifyRequest } from "fastify";
import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { ServerError } from "src/services/serverError";

export async function autoLogin(req: FastifyRequest, res: FastifyReply){
    const {user} = req

    if (!user) {
        throw new ServerError('Usuário não autenticado', 401);
    }

    res.send({user})
}
