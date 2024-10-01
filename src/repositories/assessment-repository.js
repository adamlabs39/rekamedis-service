import SessionModel from "../models/mongos/session-model.js";
import CatatanPerawatModel from "../models/mongos/catatan-perawat-model.js";
import InstruksiMedisModel from "../models/mongos/instruksi-medis-model.js";
import RekamMedisModel from "../models/mongos/rekam-medis-model.js";
import NotfoundException from "../errors/notfound-exception.js";

export default class AssessmentRepository {
    static async insert(sessionId, data, key) {
        return await SessionModel.findOneAndUpdate({_id: sessionId}, {
            [key]: data
        }, {new: true}).exec();
    }

    static async insertCatatanPerawat(sessionId, data) {
        const catatanPerawat = new CatatanPerawatModel(data);
        await catatanPerawat.save();

        return await SessionModel.findOneAndUpdate({_id: sessionId}, {
            $push :  {
                "catatan_perawat" : catatanPerawat
            }
        }, {new: true}).exec();
    }

    static async insertInstruksiMedis(sessionId, data) {
        const instruksiMedis = new InstruksiMedisModel(data);
        await instruksiMedis.save();

        return await SessionModel.findOneAndUpdate({_id: sessionId}, {
            $push :  {
                "instruksi_medis" : instruksiMedis
            }
        }, {new: true}).exec();
    }

    static async updateCatatanPerawat(catatanPerawatId, data) {
        return await CatatanPerawatModel.findOneAndUpdate({_id: catatanPerawatId}, {
            message : data.message,
            time : data.time
        }, {new: true}).exec();
    }

    static async updateInstruksiMedis(instruksiMedisId, data) {
        return await InstruksiMedisModel.findOneAndUpdate({_id: instruksiMedisId}, {
            message : data.message,
            time : data.time
        }, {new: true}).exec();
    }

    static async getItemBefore(no_rm, no_pelayanan, page = 1, limit = 10, key) {
            const pelayanan = await RekamMedisModel.findOne({ no_pelayanan: no_pelayanan });

            if (!pelayanan) {
                throw new NotfoundException(`Data pelayanan dengan no_pelayanan ${no_pelayanan} tidak ditemukan`);
            }

            const createdAtPelayanan = pelayanan.created_at;

            const totalDocuments = await RekamMedisModel.countDocuments({
                no_rm: no_rm,
                created_at: { $lt: createdAtPelayanan }
            });

            const totalPages = Math.ceil(totalDocuments / limit);

            const currentPage = page > 0 ? page : 1;

            const results = await RekamMedisModel.find({
                no_rm: no_rm,
                created_at: { $lt: createdAtPelayanan }
            })
                .populate({
                    path: 'daily_records.sessions',
                    select: key,
                })
                .sort({ created_at: -1 })
                .skip((currentPage - 1) * limit)
                .limit(limit);

            let items = [];

            await results.forEach((result) => {
                result.daily_records.forEach((dailyRecord) => {
                    dailyRecord.sessions.forEach((session, sessionIndex) => {
                        if (session[key] !== null && session[key] !== undefined){
                            items.push({
                                date: dailyRecord.created_at,
                                session : sessionIndex + 1,
                                data: session[key]
                            })
                        }
                    });
                });
            })

            return {
                data: items,
                metadata : {
                    current_page: parseInt(currentPage),
                    total_pages: totalPages,
                    total_documents: totalDocuments,
                    limit: parseInt(limit)
                }
            };
    };

}