import { FastifyReply, FastifyRequest } from "fastify";
import { validateLoginInput, findUserByCredentials, verifyUserPassword, generateAuthToken, setAuthCookie } from "src/services/authService";
import { validateStudentPlan } from "src/services/planService";

export async function loginUserController(req: any, res: FastifyReply) {
    const credentials = validateLoginInput(req.body);
    const user = await findUserByCredentials(credentials);

    if (user.role === "ALUNO") await validateStudentPlan(user.id);
    await verifyUserPassword(user, credentials.senha);

    const token = generateAuthToken(user, credentials.rememberMe);
    setAuthCookie(res, token, credentials.rememberMe);
    
    return res.status(200).send({ message: "Login realizado com sucesso" });
}