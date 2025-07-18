import { FastifyInstance } from "fastify";
import { adminRoutes } from "./adminRoutes";
import { personalRoutes } from "./personalRoutes";

type ServerRoute = (fastify: FastifyInstance) => Promise<void>;

const routes: ServerRoute[] = [
    adminRoutes,
    personalRoutes
]

export async function registerRoutes(fastify: FastifyInstance) {
    for (const route of routes){
        await route(fastify);
    }
}