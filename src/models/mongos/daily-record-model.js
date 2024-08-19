import mongoose, {Schema} from "mongoose";
import baseSchema from "./schemas/base-schema.js";
import sessionSchema from "./schemas/session-schema.js";
import mongooseInstance from "../../configurations/mongoose-instance.js";

const dailyRecordSchema = new Schema({
    session : [sessionSchema],
    faskes_uuid: {
        type: String,
        required: true,
    },
    baseSchema
})

const DailyRecordModel = mongoose.model("daily_records", dailyRecordSchema);

export default DailyRecordModel;

