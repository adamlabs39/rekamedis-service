import SessionModel from "../models/mongos/session-model.js";
import RekamMedisModel from "../models/mongos/rekam-medis-model.js";
import {toEpochDate} from "../helpers/date-helper.js";

export default class SessionRepository {
    static async getById(id) {
        return await SessionModel.findById(id).exec();
    }

    static async add(rekamMedisId, dateOrder, sessionOrder) {
        const session = new SessionModel({
            order: sessionOrder,
        });

        await session.save();
        return await RekamMedisModel.findOneAndUpdate({_id: rekamMedisId}, {
            $push: {
                [`daily_records.${dateOrder}.sessions`]: session._id
            }
        }, {new: true}).exec();
    }

    static async delete(id) {
        return await SessionModel.findOneAndUpdate({_id: id}, {
            "deleted_at": toEpochDate(new Date())
        }, {new: true}).exec();
    }
}