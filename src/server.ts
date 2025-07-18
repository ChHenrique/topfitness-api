import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifyMultipart from "@fastify/multipart";
import { registerRoutes } from "./routes/registerRoutes";

const server = fastify();

// registrando plugins
server.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
})

server.register(fastifyMultipart, {
    limits: {
        fileSize: 3000000, // 3 MB
    },
    attachFieldsToBody: true,
})

server.register(fastifyCookie)
server.register(registerRoutes)

server.get("/", () => {
    return { message: "Bem vindo a API da Academia Top Fitness!" };
})

server.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is running at ${address}`);
});




