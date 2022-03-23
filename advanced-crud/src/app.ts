import "dotenv/config";
import "express-async-errors";
import express, { Application, Request, Response } from "express";
import prisma from "./prisma";

import http, { Server } from "http";
import cors from "cors";
import compression from "compression";
import bodyParser from "body-parser";
import morgan from "morgan";

const logger = morgan("dev");

const app: Application = express();
const server: Server = http.createServer(app);

app.use(cors())
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true, limit: "2mb" }));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(express.json({ limit: "2mb" }));
app.use(logger);

const PATHNAME_PREFIX: string = "/api/v1";

app.get("*", (req, res) =>
  res.status(404).json({
    code: 404,
    message:
      "API Endpoint not found, if this is unexpected please contact the developer.",
  })
);

if (require.main === module) {
    const PORT: number = Number(process.env.PORT) || 4000;
    server.listen(PORT, () => console.log("Running on port: ", PORT));
  }
  
  export default app;
  