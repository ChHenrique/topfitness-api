import { fastifyContextDTO } from "../../interfaces/fastifyContextDTO";
import { studentSchema, studentSchemaDTO } from "../../schemas/studentSchema";
import {
  getStudentById,
  updateStudent,
} from "../../services/database/IStudentRepository";
import { normalizeMultipartBody } from "../../services/normalizeMultipartBody";
import { ServerError } from "../../services/serverError";
import { typeUploads } from "../../types/typeUploads";
import {  checkAccessWithPersonal } from "../../utils/checkAccess";
import { updateUserPhotoMultipart } from "../../utils/photoMultipart";
import { updatedFields } from "../../utils/updateFields";
import { verifyEmailOrPhoneExistUpdate } from "../../utils/verifyEmailOrPhoneExist";
import bcrypt from "bcrypt";
import { updateValidityStudent } from "../../utils/updateValidity";

export async function updateStudentController(fastify: fastifyContextDTO) {
  const isUserExist = await checkAccessWithPersonal(fastify, getStudentById);

  const rawData = fastify.req.body as studentSchemaDTO;
  const data = normalizeMultipartBody(rawData);

  const parsedData = studentSchema.partial().safeParse(data);
  
  if (!parsedData.success) {
    console.log("Erro de validação:", parsedData.error.format());
    throw new ServerError("Dados inválidos");
  }

  await verifyEmailOrPhoneExistUpdate(parsedData, isUserExist);
  await updateUserPhotoMultipart(rawData, parsedData, typeUploads.ALUNO);
  if (parsedData.data.senha) parsedData.data.senha = await bcrypt.hash(parsedData.data.senha, 10);
  if (parsedData.data.data_validade_plano) updateValidityStudent(isUserExist, parsedData)
  updatedFields(isUserExist, parsedData.data);

  const test = await updateStudent(isUserExist.id, parsedData.data);
  fastify.res
    .status(200)
    .send({ message: "Aluno atualizado com sucesso", student: test });
}
