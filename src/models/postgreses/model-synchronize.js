import InformConsentModel from "./Inform_consent-model.js";
import FileModel from "./file-model.js";
import InstalasiGawatDaruratModel from "./instalasi-gawat-darurat-model.js";
import RawatJalanModel from "./rawat-jalan-model.js";
import RawatInapModel from "./rawat-inap-model.js";

const MODELMERGE = [
    InformConsentModel,
    FileModel,
    InstalasiGawatDaruratModel,
    RawatJalanModel,
    RawatInapModel
];

export default MODELMERGE;