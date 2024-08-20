import mongoose, {Schema} from "mongoose";
import baseSchema from "./schemas/base-schema.js";

const recordSchema = new Schema({
    sessions : [{ type: Schema.Types.ObjectId, ref: 'sessions' }],
});

recordSchema.add(baseSchema);

const rekamMedisSchema = new Schema({
    daily_records : [recordSchema],
    faskes_uuid: {
        type: String,
        required: true,
    },
})

const RekamMedisModel = mongoose.model("rekam_medises", rekamMedisSchema);

export default RekamMedisModel;