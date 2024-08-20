import SessionModel from "../models/mongos/session-model.js";
import RekamMedisModel from "../models/mongos/rekam-medis-model.js";

export default class SessionRepository {
    static async getById(id) {
        return await SessionModel.findById(id).exec();
    }

    static async add(rekamMedisId, dateOrder, sessionOrder) {
        const session = new SessionModel({
            order: sessionOrder,
        });

        await session.save();
        let rekamMedis = await RekamMedisModel.findOneAndUpdate({ _id: rekamMedisId }, {
            $push: {
                [`daily_records.${dateOrder}.sessions`] : session._id
            }
        }, { new: true }).exec();
        return rekamMedis;
    }
}