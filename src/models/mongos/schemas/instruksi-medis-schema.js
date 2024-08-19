import baseSchema from "./base-schema.js";
import {Schema} from "mongoose";

const instruksiMedisSchema = new Schema({
    instruksi : {
        type: String,
    },
    petugas : {
        type: String,
        required: true,
    }
})

instruksiMedisSchema.add(baseSchema)

export default instruksiMedisSchema;