import {Schema} from "mongoose";
import baseSchema from "./base-schema.js";
import ohisSchema from "./ohis-schema.js";

const pemeriksaanFisikSchema = new Schema({
    keadaan_umum : {
        type: String,
    },
    kepala : {
        type: Boolean,
    },
    ket_kepala : {
        type: String,
    },
    gambar_kepala : {
        type: String,
    },
    mata : {
        type: Boolean,
    },
    ket_mata : {
        type: String,
    },
    gambar_mata : {
        type: String,
    },
    telinga : {
        type: Boolean,
    },
    ket_telinga : {
        type: String,
    },
    gambar_telinga : {
        type : String,
    },
    hidung : {
        type: Boolean,
    },
    ket_hidung : {
        type: String,
    },
    gambar_hidung : {
        type: String,
    },
    tenggorokan : {
        type: Boolean,
    },
    ket_tenggorokan : {
        type: String,
    },
    gambar_tenggorokan : {
        type: String,
    },
    mulut : {
        type: Boolean,
    },
    ket_mulut : {
        type: String,
    },
    gambar_mulut : {
        type: String,
    },
    leher : {
        type: Boolean,
    },
    ket_leher : {
        type: String,
    },
    gambar_leher : {
        type: String,
    },
    dada : {
        type: Boolean,
    },
    ket_dada : {
        type: String,
    },
    gambar_dada : {
        type: String,
    },
    jantung : {
        type: Boolean,
    },
    ket_jantung : {
        type: String,
    },
    gambar_jantung : {
        type: String,
    },
    paru : {
        type: Boolean,
    },
    ket_paru : {
        type: String,
    },
    gambar_paru : {
        type: String,
    },
    abdomen : {
        type: Boolean,
    },
    ket_abdomen : {
        type: String,
    },
    gambar_abdomen : {
        type: String,
    },
    anus : {
        type: Boolean,
    },
    ket_anus : {
        type: String,
    },
    gambar_anus : {
        type: String,
    },
    urogential : {
        type: Boolean,
    },
    ket_urogential : {
        type: String,
    },
    gambar_urogential : {
        type: String,
    },
    ekstermitas : {
        type: Boolean,
    },
    ket_ekstermitas : {
        type: String,
    },
    gambar_ekstermitas : {
        type: String,
    },
    muskulosketerol : {
        type: Boolean,
    },
    ket_muskulosketerol : {
        type: String,
    },
    gambar_muskulosketerol : {
        type: String,
    },
    pemeriksaan_lainnya : {
        type: String,
    },
    ohis : ohisSchema,
    petugas : {
        type: String,
        required: true,
    }
})

pemeriksaanFisikSchema.add(baseSchema)

export default pemeriksaanFisikSchema;