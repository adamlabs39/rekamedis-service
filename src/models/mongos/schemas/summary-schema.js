import {Schema} from "mongoose";
import diagnosisDokterSchema from "./diagnosis-dokter-schema.js";

const summarySchema = new Schema({
    tekanan_darah : {
        type: Number,
        default : 0,
    },
    frekuensi_nadi : {
        type: Number,
        default : 0,
    },
    frekuensi_nafas : {
        type: Number,
        default : 0,
    },
    suhu : {
        type: Number,
        default : 0,
    },
    berat_badan : {
        type: Number,
        default : 0,
    },
    warna_triase : {
        type: String,
        default : '-',
    },
    tinggi_badan : {
        type: Number,
        default : 0,
    },
    gcs_score : {
        type: Number,
        default : 0,
    },
    skala_nyeri : {
        type: Number,
        default : 0,
    },
    nama_alergi : {
        type: String,
        default : "-",
    },
    keluhan_utama : {
        type: String,
        default : "-",
    },
    diagnosis_primer : {
        type : String,
        default : "-",
    },
    anamnesis : {
        type : String,
        default : "-"
    },
    ket_kepala : {
        type : String,
    },
    ket_mata : {
        type : String,
    },
    ket_telinga : {
        type : String,
    },
    ket_hidung : {
        type : String,
    },
    ket_tenggorokan : {
        type : String,
    },
    ket_mulut : {
        type : String,
    },
    ket_leher : {
        type : String,
    },
    ket_dada : {
        type : String,
    },
    ket_jantung : {
        type : String,
    },
    ket_paru : {
        type : String,
    },
    ket_abdomen : {
        type : String,
    },
    ket_ekstremitas : {
        type : String,
    },
    ket_anus : {
        type : String,
    },
    ket_urogenital : {
        type : String,
    },
    ket_muskuloskeletal : {
        type : String,
    },
    diagnosis_dokter : [diagnosisDokterSchema],
});

export default summarySchema;