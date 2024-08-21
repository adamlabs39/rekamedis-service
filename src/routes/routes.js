import express from "express";
import RekamMedisController from "../controllers/rekam-medis-controller.js";
import SessionController from "../controllers/session-controller.js";

const apiBase = process.env.API_BASE || "api";
const apiVersion = process.env.API_VERSION || "v1";

const routes = express.Router();

// HEALTH CHECK
routes.get(`/${apiBase}/${apiVersion}/setting/health`, (req, res) => res.status(200).json({ message: "OK" }));

// REKAM MEDIS
routes.get(`/${apiBase}/${apiVersion}/rekam-medis`, RekamMedisController.get);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis`, RekamMedisController.createNew);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/record`, RekamMedisController.addRecord);

// SESSION
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/session`, SessionController.create);
routes.delete(`/${apiBase}/${apiVersion}/rekam-medis/session`, SessionController.delete);

export default routes;