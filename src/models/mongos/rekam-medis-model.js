import mongoose, {Schema} from "mongoose";
import baseSchema from "./schemas/base-schema.js";
import summarySchema from "./schemas/summary-schema.js";

const recordSchema = new Schema({
    sessions : [{ type: Schema.Types.ObjectId, ref: 'sessions' }],
    date : {
        type: String,
        required: true,
    },
});

recordSchema.add(baseSchema);

const rekamMedisSchema = new Schema({
    daily_records : [recordSchema],
    faskes_uuid: {
        type: String,
        required: true
    },
    no_reg : {
        type: String,
        required: true,
    },
    no_rm : {
        type: String,
        required: true,
    },
    summary : {
        type: summarySchema,
        default: () => ({})
    },
})

const RekamMedisModel = mongoose.model("rekam_medises", rekamMedisSchema);

export default RekamMedisModel;