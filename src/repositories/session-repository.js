import SessionModel from "../models/mongos/session-model.js";
import RekamMedisModel from "../models/mongos/rekam-medis-model.js";
import {toEpochDate} from "../helpers/date-helper.js";

export default class SessionRepository {
    static async getById(id) {
        return await SessionModel.findById(id).exec();
    }

    static async add(rekamMedisId, dateOrder) {
        const session = new SessionModel();

        await session.save();
        return await RekamMedisModel.findOneAndUpdate({_id: rekamMedisId}, {
            $push: {
                [`daily_records.${dateOrder}.sessions`]: session._id
            }
        }, {new: true}).exec();
    }

    static async delete(id, alasan) {
        return await SessionModel.findOneAndUpdate({_id: id}, {
            "deleted_at": toEpochDate(new Date(),),
            "alasan": alasan
        }, {new: true}).exec();
    }
}