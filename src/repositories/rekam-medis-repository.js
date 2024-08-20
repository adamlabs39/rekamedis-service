import RekamMedisModel from "../models/mongos/rekam-medis-model.js";

export default class RekamMedisRepository {
    static async get(request) {
        return await RekamMedisModel.findById(request.rekam_medis_id).populate(
            {
                path: "daily_records.sessions",
                select: "order _id"
            }

        ).exec();
        // data = await sessionModel.findById(rekamMedis.daily_records[date_order].sessions[session_order]._id).exec();
    }

    static async createNew(createRequest) {
        const rekamMedis = new RekamMedisModel({
            daily_records: [{
                sessions: [],
            }],
            faskes_uuid: createRequest.faskes_uuid,
        });

        return await rekamMedis.save();
    }
}