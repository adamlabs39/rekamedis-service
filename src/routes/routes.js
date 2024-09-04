import express from "express";
import RekamMedisController from "../controllers/rekam-medis-controller.js";
import SessionController from "../controllers/session-controller.js";
import AssessmentController from "../controllers/assessment-controller.js";
import FileController from "../controllers/file-controller.js";
import InformConsentController from "../controllers/inform-consent-controller.js";

const apiBase = process.env.API_BASE || "api";
const apiVersion = process.env.API_VERSION || "v1";

const routes = express.Router();

// HEALTH CHECK
routes.get(`/${apiBase}/${apiVersion}/setting/health`, (req, res) => res.status(200).json({ message: "OK" }));

// REKAM MEDIS
routes.get(`/${apiBase}/${apiVersion}/rekam-medis`, RekamMedisController.get);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis`, RekamMedisController.createNew);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/record`, RekamMedisController.addRecord);
routes.get(`/${apiBase}/${apiVersion}/rekam-medis/history`, RekamMedisController.getHistory);

// SESSION
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/session`, SessionController.create);
routes.delete(`/${apiBase}/${apiVersion}/rekam-medis/session`, SessionController.delete);

// ASSESSMENT
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/assessment`, AssessmentController.insert);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/chat/catatan`, AssessmentController.insertCatatanPerawat);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/chat/instruksi`, AssessmentController.insertInstruksiMedis);
routes.put(`/${apiBase}/${apiVersion}/rekam-medis/chat/instruksi`, AssessmentController.updateInstruksiMedis);
routes.put(`/${apiBase}/${apiVersion}/rekam-medis/chat/catatan`, AssessmentController.updateCatatanPerawat);

// FILES
routes.get(`/${apiBase}/${apiVersion}/rekam-medis/files`, FileController.getAll);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/files`, FileController.upload);
routes.delete(`/${apiBase}/${apiVersion}/rekam-medis/files`, FileController.delete);
routes.put(`/${apiBase}/${apiVersion}/rekam-medis/files`, FileController.update);
routes.get(`/${apiBase}/${apiVersion}/rekam-medis/files/letters`, FileController.getLetters);

// INFORM CONSENT
routes.get(`/${apiBase}/${apiVersion}/rekam-medis/inform-consent`, InformConsentController.getAll);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/inform-consent`, InformConsentController.create);

export default routes;