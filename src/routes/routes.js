import express from "express";
import RekamMedisController from "../controllers/rekam-medis-controller.js";
import SessionController from "../controllers/session-controller.js";
import AssessmentController from "../controllers/assessment-controller.js";
import FileController from "../controllers/file-controller.js";
import InformConsentController from "../controllers/inform-consent-controller.js";
import PelayananController from "../controllers/pelayanan-controller.js";
import FpoController from "../controllers/fpo-controller.js";

const apiBase = process.env.API_BASE || "api";
const apiVersion = process.env.API_VERSION || "v1";

const routes = express.Router();

// HEALTH CHECK
routes.get(`/${apiBase}/${apiVersion}/setting/health`, (req, res) => res.status(200).json({ message: "OK" }));

// FPO
routes.get(`/${apiBase}/${apiVersion}/rekam-medis/fpo`, FpoController.get);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/fpo`, FpoController.insert);
routes.put(`/${apiBase}/${apiVersion}/rekam-medis/fpo`, FpoController.update);

// REKAM MEDIS
routes.get(`/${apiBase}/${apiVersion}/rekam-medis`, RekamMedisController.get);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis`, RekamMedisController.createNew);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/record`, RekamMedisController.addRecord);

// SESSION
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/session`, SessionController.create);
routes.delete(`/${apiBase}/${apiVersion}/rekam-medis/session`, SessionController.delete);

// ASSESSMENT
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/assessment`, AssessmentController.insert);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/chat/catatan`, AssessmentController.insertCatatanPerawat);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/chat/instruksi`, AssessmentController.insertInstruksiMedis);
routes.put(`/${apiBase}/${apiVersion}/rekam-medis/chat/instruksi`, AssessmentController.updateInstruksiMedis);
routes.put(`/${apiBase}/${apiVersion}/rekam-medis/chat/catatan`, AssessmentController.updateCatatanPerawat);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/tindakan`, AssessmentController.insertTindakan);
routes.get(`/${apiBase}/${apiVersion}/rekam-medis/item-before`, AssessmentController.getItemBefore);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/order-obat`, AssessmentController.pushOrderObat);
routes.get(`/${apiBase}/${apiVersion}/rekam-medis/chat/instruksi`, SessionController.getInstruksiMedises);
routes.get(`/${apiBase}/${apiVersion}/rekam-medis/chat/catatan`, SessionController.getCatatanPerawat);

// INFORM CONSENT
routes.get(`/${apiBase}/${apiVersion}/rekam-medis/inform-consent`, InformConsentController.getAll);
routes.post(`/${apiBase}/${apiVersion}/rekam-medis/inform-consent`, InformConsentController.create);

// PELAYANAN
routes.put(`/${apiBase}/${apiVersion}/pelayanan/resume`, PelayananController.updateResume);
routes.get(`/${apiBase}/${apiVersion}/pelayanan/resume`, PelayananController.getResume);
routes.put(`/${apiBase}/${apiVersion}/pelayanan/discharge`, PelayananController.dischargeService);
routes.get(`/${apiBase}/${apiVersion}/pelayanan/files`, FileController.getAll);
routes.post(`/${apiBase}/${apiVersion}/pelayanan/files`, FileController.upload);
routes.delete(`/${apiBase}/${apiVersion}/pelayanan/files`, FileController.delete);
routes.put(`/${apiBase}/${apiVersion}/pelayanan/files`, FileController.update);
routes.get(`/${apiBase}/${apiVersion}/pelayanan/files/letters`, FileController.getLetters);
routes.get(`/${apiBase}/${apiVersion}/pelayanan/files/generate-code`, FileController.generateLetterCode);
routes.get(`/${apiBase}/${apiVersion}/pelayanan/history`, RekamMedisController.getHistory);

export default routes;