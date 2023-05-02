import { UserController } from "./user";
import express from "express";
import { NewsController } from "./news";
import { FileController } from "./file";

const controllers = [
  UserController,
  NewsController,
  FileController,
]

/**
 * Used to map all API routes
 */
export function buildControllers() {
  const router = express.Router();

  controllers.forEach(c => new c(router));

  return router;
}
