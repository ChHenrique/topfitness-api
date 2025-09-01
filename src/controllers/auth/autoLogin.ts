import { FastifyReply, FastifyRequest } from "fastify";
import { fastifyContextDTO } from "../../interfaces/fastifyContextDTO";
import { ServerError } from "../../services/serverError";

export async function autoLogin(req: FastifyRequest, res: FastifyReply){
    const {user} = req

    if (!user) {
        return false
    }

    res.send({user})
}
