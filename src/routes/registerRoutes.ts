import { FastifyInstance } from "fastify";
import { adminRoutes } from "./adminRoutes";
import { personalRoutes } from "./personalRoutes";
import { studentRoutes } from "./studentRoutes";

type ServerRoute = (fastify: FastifyInstance) => Promise<void>;

const routes: ServerRoute[] = [
    adminRoutes,
    personalRoutes,
    studentRoutes
]

export async function registerRoutes(fastify: FastifyInstance) {
    for (const route of routes){
        await route(fastify);
    }
}