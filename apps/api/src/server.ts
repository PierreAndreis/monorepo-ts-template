import { json, urlencoded } from "body-parser";
import { expressLogger } from "logger";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import logger from "./logger";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(expressLogger(logger))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/healthz", (req, res) => {
      return res.json({ ok: true });
    });

  return app;
};
