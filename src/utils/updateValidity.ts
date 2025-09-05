import { getPlan } from "../services/database/IPlanRepository";
import { ServerError } from "../services/serverError";
import { calculateValidity } from "./calculateValidity";

export async function updateValidityStudent(isUserExist: any, parsedData: any) {
    const expirationValidity = isUserExist.data_validade_plano < new Date();
    if (!expirationValidity)
      throw new ServerError(
        "O plano ainda está ativo. Só pode ser renovado após o vencimento."
      );

    const plano = await getPlan(isUserExist.plano_id);
    if (!plano) throw new ServerError("Plano não encontrado", 404);

    const newValidity = calculateValidity(
      plano.duracaoMeses,
      new Date().toISOString()
    );

    parsedData.data.data_validade_plano = newValidity;
}