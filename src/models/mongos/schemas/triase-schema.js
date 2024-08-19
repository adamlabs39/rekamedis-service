import {Schema} from "mongoose";
import baseSchema from "./base-schema.js";

const triaseSchema = new Schema({
    kasus : {
        type: Number,
    },
    eye : {
        type: Number,
    },
    verbal : {
        type: Number,
    },
    motorik : {
        type: Number,
    },
    gcs_score : {
        type: Number,
    },
    tekanan_darah_sistole : {
        type: Number,
    },
    tekanan_darah_diastole : {
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
    kesimpulan_triase : {
        type: String,
    },
    doa_triase : {
        type: String,
    },
    dead_time : {
        type: Number,
    },
    doa_time : {
        type: Number,
    },
    petugas : {
        type: String,
        required: true,
    }
})

triaseSchema.add(baseSchema)

export default triaseSchema;
