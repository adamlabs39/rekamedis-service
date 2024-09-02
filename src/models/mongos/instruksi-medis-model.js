import mongoose, {Schema} from "mongoose";

const instruksiMedisSchema = new Schema({
    message : {
        type: String,
        required: true,
    },
    name : {
        type: String,
        required: true,
    },
    user_uuid : {
        type: String,
        required: true,
    },
    time : {
        type: Number,
        required: true,
    }
})

const InstruksiMedisModel = mongoose.model("instruksi_medises", instruksiMedisSchema);

export default InstruksiMedisModel;