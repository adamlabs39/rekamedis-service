import {Schema} from "mongoose";
import baseSchema from "./base-schema.js";

const pemeriksaanTindakanSchema = new Schema({
    tarif_uuid : {
        type: String,
        required: true,
    },
    nama_tindakan : {
        type: String,
        required: true,
    },
    harga_tindakan : {
        type: Number,
        required: true,
    },
    qty_tindakan : {
        type: Number,
        required: true,
    },
    petugas : [{
        type: String,
        required: true,
    }]
})

pemeriksaanTindakanSchema.add(baseSchema)

export default pemeriksaanTindakanSchema;