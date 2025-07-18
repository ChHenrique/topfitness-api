import { FastifyInstance } from "fastify";
import { adminRoutes } from "./adminRoutes";

type ServerRoute = (fastify: FastifyInstance) => Promise<void>;

const routes: ServerRoute[] = [
    adminRoutes,
]

export async function registerRoutes(fastify: FastifyInstance) {
    for (const route of routes){
        await route(fastify);
    }
}