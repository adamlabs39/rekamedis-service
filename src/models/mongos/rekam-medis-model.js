import mongoose, {Schema} from "mongoose";
import mongooseInstance from "../../configurations/mongoose-instance.js";

const RekamMedisSchema = new Schema({
    daily_records : [{ type: Schema.Types.ObjectId, ref: 'DailyRecord' }]
})

const RekamMedisModel = mongoose.model("rekam_medises", RekamMedisSchema);

export default RekamMedisModel;