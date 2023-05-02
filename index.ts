import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { json, urlencoded } from "body-parser";
import mongoose from "mongoose";
import { envVars } from "./src/config/envvars";
import cookieParser from "cookie-parser";
import { buildControllers } from "./src/controllers/builder";
import path from "path";
import { validateJWTToken } from "./src/middlewares/validateJWTToken";
import os from "os";
import http from "http";
import WebSocket from "ws";

const app = express();
app.use(cors({
  credentials: true,
  origin: envVars.corsOrigin
}));
app.use(json());
app.use(urlencoded({ extended:true }));
app.use(cookieParser());
app.use(validateJWTToken);
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: os.tmpdir(),
}));
app.use(express.static(path.join(__dirname, "public")));

app.use(buildControllers());

mongoose.connect(envVars.mongodbConnectString).then(() => console.log("[MONGODB]: AIR"));

const server = http.createServer(app);
export const wss = new WebSocket.Server({ server });

server.listen(envVars.wssPort, () => console.log("[WSS]: AIR"));

app.listen(envVars.serverPort, () => console.log("[SERVER]: AIR"));
