import { fastifyContextDTO } from "src/interfaces/fastifyContextDTO";
import { loginStudentSchema, LoginStudentSchemaDTO } from "src/schemas/studentSchema";
import { getStudentByEmail, getStudentByPhone } from "src/services/database/IStudentRepository";
import { ServerError } from "src/services/serverError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginStudentController(fastify: fastifyContextDTO){
    const data = fastify.req.body as LoginStudentSchemaDTO;
    let student;

    const parsedData = loginStudentSchema.safeParse(data);
    if (!parsedData.success) {
        console.log("erro: ", parsedData.error.format);
        throw new Error("Dados inválidos");
    }

    if (parsedData.data.email){
        student = await getStudentByEmail(parsedData.data.email);
    } else if (parsedData.data.telefone){
        student = await getStudentByPhone(parsedData.data.telefone);
    } else {
            throw new ServerError("Credencias inválidas");
    }

    if (!student) throw new ServerError("Credenciais inválidas");

    const isPasswordValid = await bcrypt.compare(parsedData.data.senha, student.senha);
    if (!isPasswordValid) throw new ServerError("Credenciais inválidas");

    const payload = {
        id: student.id,
        role: "ALUNO",
        email: student.email,
        rememberMe: parsedData.data.rememberMe,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: parsedData.data.rememberMe ? "60d" : "1h",
    });

    fastify.res.setCookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: parsedData.data.rememberMe ? 60 * 60 * 24 * 60 : 60 * 60,
        path: "/student"
    }).send({message: "Login realizado com sucesso",
    });
}