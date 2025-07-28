import { FastifyInstance } from "fastify";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";

// ✅ Simula __dirname corretamente em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function staticFilesPlugin(fastify: FastifyInstance) {
  const pathToUploads = join(__dirname, "..", "..", "uploads");

  fastify.register(fastifyStatic, {
    root: pathToUploads,
    prefix: "/uploads/",
  });
}
