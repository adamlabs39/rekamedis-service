import {Schema} from "mongoose";
import alergiSchema from "./alergi-schema.js";
import anamnesisSchema from "./anamnesis-schema.js";
import anamnesaIgdSchema from "./anamnesa-igd-schema.js";
import antropometriSchema from "./antropometri-schema.js";
import asesmenNyeriSchema from "./asesmen-nyeri-schema.js";
import catatanPenunjangSchema from "./catatan-penunjang-schema.js";
import catatanPerawatSchema from "./catatan-perawat-schema.js";
import diagnosaDokterSchema from "./diagnosa-dokter-schema.js";
import diagnosaPerawatSchema from "./diagnosa-perawat-schema.js";
import instruksiMedisSchema from "./instruksi-medis-schema.js";
import kesadaranSchema from "./kesadaran-schema.js";
import lukaBakarSchema from "./luka-bakar-schema.js";
import pemeriksaanFisikSchema from "./pemeriksaan-fisik-schema.js";
import pemeriksaanTindakanSchema from "./pemeriksaan-tindakan-schema.js";
import tandaVitalSchema from "./tanda-vital-schema.js";
import triaseSchema from "./triase-schema.js";
import fpoSchema from "./fpo_schema.js";

const sessionSchema = new Schema(
    {
        alergi : alergiSchema,
        anamnesis : anamnesisSchema,
        anemsis_igd : anamnesaIgdSchema,
        antropometri : antropometriSchema,
        asesmen_nyeri : asesmenNyeriSchema,
        catatan_penunjang : catatanPenunjangSchema,
        catatan_perawat : catatanPerawatSchema,
        diagnosa_dokter : diagnosaDokterSchema,
        diagnosa_perawat : diagnosaPerawatSchema,
        instruksi_medis : instruksiMedisSchema,
        kesadaran : kesadaranSchema,
        luka_bakar : lukaBakarSchema,
        pemeriksaan_fisik : pemeriksaanFisikSchema,
        pemeriksaan_tindakan : pemeriksaanTindakanSchema,
        tanda_vital : tandaVitalSchema,
        triase : triaseSchema,
        fpo : fpoSchema,
    }
)

export default sessionSchema;