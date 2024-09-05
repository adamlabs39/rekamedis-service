import {Schema} from "mongoose";

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
    }
});

export default summarySchema;