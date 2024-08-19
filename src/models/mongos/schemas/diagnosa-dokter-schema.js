import baseSchema from "./base-schema.js";
import {Schema} from "mongoose";

const diagnosaDokterSchema = new Schema({
    diagnosis_uuid : {
        type: String,
    },
    diagnosa_primer : {
        type: String,
    },
    diagnosa_sekunder : {
        type: String,
    },
    diganosa_dd : {
        type: String,
    },
    petugas : {
        type: String,
        required: true,
    }
})

diagnosaDokterSchema.add(baseSchema)

export default diagnosaDokterSchema;