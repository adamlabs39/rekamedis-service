import mongoose, {model, Schema} from "mongoose";
import alergiSchema from "./schemas/alergi-schema.js";
import anamnesisSchema from "./schemas/anamnesis-schema.js";
import anamnesaIgdSchema from "./schemas/anamnesa-igd-schema.js";
import antropometriSchema from "./schemas/antropometri-schema.js";
import asesmenNyeriSchema from "./schemas/asesmen-nyeri-schema.js";
import catatanPenunjangSchema from "./schemas/catatan-penunjang-schema.js";
import catatanPerawatSchema from "./schemas/catatan-perawat-schema.js";
import diagnosaDokterSchema from "./schemas/diagnosa-dokter-schema.js";
import diagnosaPerawatSchema from "./schemas/diagnosa-perawat-schema.js";
import instruksiMedisSchema from "./schemas/instruksi-medis-schema.js";
import kesadaranSchema from "./schemas/kesadaran-schema.js";
import lukaBakarSchema from "./schemas/luka-bakar-schema.js";
import pemeriksaanFisikSchema from "./schemas/pemeriksaan-fisik-schema.js";
import pemeriksaanTindakanSchema from "./schemas/pemeriksaan-tindakan-schema.js";
import tandaVitalSchema from "./schemas/tanda-vital-schema.js";
import triaseSchema from "./schemas/triase-schema.js";
import fpoSchema from "./schemas/fpo_schema.js";

const sessionSchema = new Schema(
    {
        order: {
            type: Number,
        },
        alergi: alergiSchema,
        anamnesis: anamnesisSchema,
        anemsis_igd: anamnesaIgdSchema,
        antropometri: antropometriSchema,
        asesmen_nyeri: asesmenNyeriSchema,
        catatan_penunjang: catatanPenunjangSchema,
        catatan_perawat: catatanPerawatSchema,
        diagnosa_dokter: diagnosaDokterSchema,
        diagnosa_perawat: diagnosaPerawatSchema,
        instruksi_medis: instruksiMedisSchema,
        kesadaran: kesadaranSchema,
        luka_bakar: lukaBakarSchema,
        pemeriksaan_fisik: pemeriksaanFisikSchema,
        pemeriksaan_tindakan: pemeriksaanTindakanSchema,
        tanda_vital: tandaVitalSchema,
        triase: triaseSchema,
        fpo: fpoSchema,
    }
)

const SessionModel = mongoose.model("sessions", sessionSchema);

export default SessionModel;