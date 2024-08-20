import RekamMedisModel from "../models/mongos/rekam-medis-model.js";
import mongoose from "mongoose";
import SessionModel from "../models/mongos/session-model.js";

export default class RekamMedisRepository {
    static async get(request) {
        return await RekamMedisModel.findById(request.rekam_medis_uuid).populate(
            {
                path: "daily_records.sessions",
                select: "order _id deleted_at",
                match: {deleted_at: null},
            }
        ).exec();
    }


    static async createNew(createRequest) {
        let session = null;

        return mongoose.startSession()
            .then(_session => {
                session = _session;
                session.startTransaction();

                const newSession = new SessionModel({
                    order: 1,
                });

                return newSession.save({ session });
            })
            .then(newSession => {
                const rekamMedis = new RekamMedisModel({
                    daily_records: [{sessions : [newSession._id]}],
                    faskes_uuid: createRequest.faskes_uuid,
                });

                return rekamMedis.save({ session });
            })
            .then(rekamMedis => {
                return session.commitTransaction().then(() => rekamMedis);
            })
            .then(rekamMedis => {
                return session.endSession().then(() => rekamMedis);
            })
            .catch(err => {
                return session.abortTransaction()
                    .then(() => session.endSession())
                    .then(() => { throw err; });
            });
    }

    static async
}