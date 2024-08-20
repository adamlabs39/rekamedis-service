import SessionModel from "../models/mongos/session-model.js";

export default class SessionRepository {
    static async getById(id) {
        return await SessionModel.findById(id).exec();
    }
}