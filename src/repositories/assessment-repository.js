import SessionModel from "../models/mongos/session-model.js";

export default class AssessmentRepository {
    static async insert(sessionId, data, key) {
        return await SessionModel.findOneAndUpdate({_id: sessionId}, {
            [key]: data
        }, {new: true}).exec();
    }
}