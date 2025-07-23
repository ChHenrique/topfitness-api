import { getUserByEmail, getUserByPhone } from "src/services/database/IUserRepository";
import { ServerError } from "src/services/serverError";

export async function verifyEmailOrPhoneExist(parsedData: any) {
    if (parsedData.data.email) {
        const isEmailExist = await getUserByEmail(parsedData.data.email);
        if (isEmailExist) throw new ServerError("Email já cadastrado", 409);
    };

    if (parsedData.data.telefone) {
        const isPhoneExist = await getUserByPhone(parsedData.data.telefone);
        if (isPhoneExist) throw new ServerError("Telefone já cadastrado", 409);
    };
}