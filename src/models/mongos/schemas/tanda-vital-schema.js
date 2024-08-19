import {Schema} from "mongoose";
import baseSchema from "./base-schema.js";

const tandaVitalSchema = new Schema({
    kriteria_pemantauan : {
        type: String,
    },
    tekanan_darah : {
        type: Number,
    },
    frekuensi_nafas : {
        type: Number,
    },
    frekuensi_nadi : {
        type: Number,
    },
    suhu : {
        type: Number,
    },
    crt : {
        type: Boolean,
    },
    blood_oxygen : {
        type: Number,
    },
    gula_darah : {
        type: Number,
    },
    oksigen_tambahan : {
        type: Boolean,
    },
    waktu_asesmen : {
        type : Number
    },
    respirasi_anak : {
        type : Number
    },
    kardiovaskuler_anak : {
        type : Number
    },
    keadaan_umum : {
        type : Number
    },
    petugas : {
        type: String,
        required: true,
    }
})

tandaVitalSchema.add(baseSchema)

export default tandaVitalSchema;