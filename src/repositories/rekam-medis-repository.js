import RekamMedisModel from "../models/mongos/rekam-medis-model.js";
import mongoose from "mongoose";
import SessionModel from "../models/mongos/session-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import RawatJalanModel from "../models/postgreses/rawat-jalan-model.js";
import RawatInapModel from "../models/postgreses/rawat-inap-model.js";
import InstalasiGawatDaruratModel from "../models/postgreses/instalasi-gawat-darurat-model.js";
import {Op} from "sequelize";

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

    static async getResumeNeed(request) {
        return await RekamMedisModel.findById(request.rekam_medis_uuid).populate(
            {
                path: "daily_records.sessions",
                select: "pemeriksaan_tindakan tanda_vital pemeriksaan_fisik",
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

                const newSession = new SessionModel();

                return newSession.save({session});
            })
            .then(newSession => {
                const rekamMedis = new RekamMedisModel({
                    daily_records: [{sessions: [newSession._id], date : createRequest.date}],
                    faskes_uuid: createRequest.faskes_uuid,
                    no_reg: createRequest.no_reg,
                    no_rm: createRequest.no_rm,
                    pelayanan : createRequest.pelayanan,
                    lokasi_uuid : createRequest.lokasi_uuid
                });

                return rekamMedis.save({session});
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
                    .then(() => {
                        throw err;
                    });
            });
    }

    static async addRecord(id, date) {
        const session = new SessionModel();

        await session.save();

        return await RekamMedisModel.findOneAndUpdate({_id: id}, {
            $push: {
                "daily_records": {
                    sessions: [session._id],
                    date : date
                }
            }
        }, {new: true}).exec();
    }

    static async getHistory(noRm, faskesUuid) {
        return await sequelizeInstance.transaction(async (tr) => {
                const [rawatJalan, rawatInap, igd] = await Promise.all(
                    [
                        RawatJalanModel.findAll(
                            {
                                where: {
                                    [Op.and] : [
                                        {
                                            noRm: noRm,
                                            faskesUuid: faskesUuid
                                        },
                                        {
                                            deletedAt: {
                                                [Op.is]: null
                                            }
                                        }
                                    ]
                                },
                                transaction: tr,
                            }
                        ),
                        RawatInapModel.findAll(
                            {
                                where: {
                                    [Op.and] : [
                                        {
                                            noRm: noRm,
                                            faskesUuid: faskesUuid
                                        },
                                        {
                                            deletedAt: {
                                                [Op.is]: null
                                            }
                                        }
                                    ]
                                },
                                transaction: tr,
                            }
                        ),
                        InstalasiGawatDaruratModel.findAll(
                            {
                                where: {
                                    [Op.and] : [
                                        {
                                            noRm: noRm,
                                            faskesUuid: faskesUuid
                                        },
                                        {
                                            deletedAt: {
                                                [Op.is]: null
                                            }
                                        }
                                    ]
                                },
                                transaction: tr,
                            }
                        ),
                    ]
                );

                return {
                    rawatJalan, rawatInap, igd
                }
            }
        )
    }

    static async updateSummary(request){
        const updateFields = {};

        for (const key in request.summary) {
            if (request.summary.hasOwnProperty(key)) {
                updateFields[`summary.${key}`] = request.summary[key];
            }
        }

        return await RekamMedisModel.findOneAndUpdate({_id: request.rekam_medis_uuid},
        {$set: updateFields}, {new: true}
        ).exec();
    }
}