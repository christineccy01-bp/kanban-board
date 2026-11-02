import { type Express, type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "express API Docs",
            version: "1.0.0"
        }
    },
    apis: ["./src/routes/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number){
    app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get("/docs.json", (_: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    console.log(`Swagger docs available at http://localhost:${port}/api`);
}

export default swaggerDocs;