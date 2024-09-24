import InformConsentModel from "./Inform_consent-model.js";
import FileModel from "./file-model.js";
import InstalasiGawatDaruratModel from "./instalasi-gawat-darurat-model.js";
import RawatJalanModel from "./rawat-jalan-model.js";
import RawatInapModel from "./rawat-inap-model.js";
import HistoryTindakanModel from "./history-tindakan-model.js";
import PetugasTindakanModel from "./petugas-tindakan-model.js";
import PegawaiModel from "./pegawai-model.js";
import PractitionerModel from "./practitioner-model.js";
import LokasiModel from "./lokasi-model.js";
import OrderFisioModel from "./order-fisio-model.js";

const MODELMERGE = [
    InformConsentModel,
    FileModel,
    InstalasiGawatDaruratModel,
    RawatJalanModel,
    RawatInapModel,
    HistoryTindakanModel,
    PetugasTindakanModel,
    PegawaiModel,
    PractitionerModel,
    LokasiModel,
    OrderFisioModel
];

export default MODELMERGE;