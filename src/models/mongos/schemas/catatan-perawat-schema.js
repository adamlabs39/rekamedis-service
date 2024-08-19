import {Schema} from "mongoose";
import baseSchema from "./base-schema.js";

const catatanPerawatSchema = new Schema({
    catatan : {
        type: String,
    },
    petugas : {
        type: String,
        required: true,
    }
})


catatanPerawatSchema.add(baseSchema)

export default catatanPerawatSchema;