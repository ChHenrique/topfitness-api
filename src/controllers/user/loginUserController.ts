import { FastifyReply, FastifyRequest } from "fastify";
import { validateLoginInput, findUserByCredentials,verifyUserPassword, generateAuthToken, setAuthCookie } from "src/services/authService";

export async function loginUserController(req: any, res: FastifyReply) {
    const credentials = validateLoginInput(req.body);
    const user = await findUserByCredentials(credentials);
    
    await verifyUserPassword(user, credentials.senha);

    const token = generateAuthToken(user, credentials.rememberMe);
    setAuthCookie(res, token, credentials.rememberMe);
    
    return res.status(200).send({ message: "Login realizado com sucesso" });
}