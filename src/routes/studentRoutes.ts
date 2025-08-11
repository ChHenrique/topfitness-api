import { FastifyInstance } from "fastify";
import { get } from "http";
import { createStudentController } from "../controllers/student/createStudentController";
import { deleteStudentController } from "../controllers/student/deleteStudentController";
import { getAllStudentsController } from "../controllers/student/getAllStudentController";
import { getStudentController } from "../controllers/student/getStundentController";
import { loginStudentController } from "../controllers/student/loginStudentController";
import { logoutStudentController } from "../controllers/student/logoutStudentController";
import { notifyStudentCOntroller } from "../controllers/student/notifyStudentController";
import { overdueStudentByPersonalController, overdueStudentController } from "../controllers/personal/overdueStudentPersonalController";
import { updateStudentController } from "../controllers/student/updateStudentController";
import { updateValidityController } from "../controllers/admin/updateValidityStudentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getAllPlanController } from "../controllers/plan/getAllPlanController";
import { linkPersonalToStudentControler, unlinkPersonalToStudentControler } from "../controllers/student/linkPersonalToStudentController";

export async function studentRoutes(fastify: FastifyInstance) {
    fastify.post("/student/register", { preHandler: authMiddleware }, async (req, res) => await createStudentController({ req, res }));

    fastify.post("/student/login", async (req, res) => await loginStudentController({ req, res }));

    fastify.delete("/student/logout/:id", { preHandler: authMiddleware }, async (req, res) => await logoutStudentController({ req, res }));

    fastify.put("/student/:id", { preHandler: authMiddleware }, async (req, res) => await updateStudentController({ req, res }));

    fastify.get("/student/:id", { preHandler: authMiddleware }, async (req, res) => await getStudentController({ req, res }));

    fastify.get("/student/all", { preHandler: authMiddleware }, async (req, res) => getAllStudentsController({ req, res }));

    fastify.delete("/student/:id", { preHandler: authMiddleware }, async (req, res) => deleteStudentController({ req, res }));  

    fastify.post("/student/notify", {preHandler: authMiddleware}, async (req, res) => notifyStudentCOntroller({req,res}))

    fastify.get("/student/plan", async (req, res) => await getAllPlanController({req, res}))

    fastify.put("/student/link-to-personal/:idStudent", {preHandler: authMiddleware}, async (req, res) => await linkPersonalToStudentControler({req, res}))

    fastify.put("/student/unlink-to-personal/:idStudent",{preHandler: authMiddleware}, async (req, res) => await unlinkPersonalToStudentControler({req, res}))
}