import express from "express";

const apiBase = process.env.API_BASE || "api";
const apiVersion = process.env.API_VERSION || "v1";

const routes = express.Router();

// HEALTH CHECK
routes.get(`/${apiBase}/${apiVersion}/setting/health`, (req, res) => res.status(200).json({ message: "OK" }));

export default routes;