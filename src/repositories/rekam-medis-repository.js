import RekamMedisModel from "../models/mongos/rekam-medis-model.js";
import mongoose from "mongoose";
import SessionModel from "../models/mongos/session-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import RawatJalanModel from "../models/postgreses/rawat-jalan-model.js";
import RawatInapModel from "../models/postgreses/rawat-inap-model.js";
import InstalasiGawatDaruratModel from "../models/postgreses/instalasi-gawat-darurat-model.js";
import {Op} from "sequelize";
import PractitionerModel from "../models/postgreses/practitioner-model.js";
import PegawaiModel from "../models/postgreses/pegawai-model.js";
import LokasiModel from "../models/postgreses/lokasi-model.js";
import OrderFisioModel from "../models/postgreses/order-fisio-model.js";

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
                    no_pelayanan : createRequest.no_pelayanan,
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
                const [rawatJalan, rawatInap, igd, fisio] = await Promise.all(
                    [
                        RawatJalanModel.findAll(
                            {
                                include : [
                                    {
                                        model: PractitionerModel,
                                        as: "practitioner",
                                        required: true,
                                        where: {deletedAt: {[Op.is]: null}},
                                        attributes: ["uuid"],
                                        include: [
                                            {
                                                model: PegawaiModel,
                                                as: "pegawai",
                                                required: true,
                                                where: {deletedAt: {[Op.is]: null}},
                                                attributes: ["title", "nama", "gender"]
                                            }
                                        ]
                                    },
                                    {
                                        model: LokasiModel,
                                        as: "lokasi",
                                        required: true,
                                        where: {deletedAt: {[Op.is]: null}},
                                        attributes: ["code", "name", "uuid"]
                                    }
                                ],
                                where: {
                                    [Op.and] : [
                                        {
                                            noRm: noRm,
                                            faskesUuid: faskesUuid,
                                            statusRj : {
                                                [Op.eq] : 5
                                            }
                                        },
                                        {
                                            deletedAt: {
                                                [Op.is]: null
                                            }
                                        }
                                    ]
                                },
                                attributes: ["no_reg", "faskes_uuid", "uuid", "status_rj", "tanggal_daftar", "payment_method", "rekam_medis_uuid"],
                                transaction: tr,
                            }
                        ),
                        RawatInapModel.findAll(
                            {
                                include : [
                                    {
                                        model: PractitionerModel,
                                        as: "practitioner",
                                        required: true,
                                        where: {deletedAt: {[Op.is]: null}},
                                        attributes: ["uuid"],
                                        include: [
                                            {
                                                model: PegawaiModel,
                                                as: "pegawai",
                                                required: true,
                                                where: {deletedAt: {[Op.is]: null}},
                                                attributes: ["title", "nama", "gender"]
                                            }
                                        ]
                                    }
                                ],
                                where: {
                                    [Op.and] : [
                                        {
                                            noRm: noRm,
                                            faskesUuid: faskesUuid,
                                            statusRi : {
                                                [Op.eq] : 4
                                            }
                                        },
                                        {
                                            deletedAt: {
                                                [Op.is]: null
                                            }
                                        }
                                    ]
                                },
                                attributes: ["no_reg", "faskes_uuid", "uuid", "status_ri", "tanggal_daftar", "payment_method", "rekam_medis_uuid"],
                                transaction: tr,
                            }
                        ),
                        InstalasiGawatDaruratModel.findAll(
                            {
                                include : [
                                    {
                                        model: PractitionerModel,
                                        as: "practitioner",
                                        required: true,
                                        where: {deletedAt: {[Op.is]: null}},
                                        attributes: ["uuid"],
                                        include: [
                                            {
                                                model: PegawaiModel,
                                                as: "pegawai",
                                                required: true,
                                                where: {deletedAt: {[Op.is]: null}},
                                                attributes: ["title", "nama", "gender"]
                                            }
                                        ]
                                    }
                                ],
                                where: {
                                    [Op.and] : [
                                        {
                                            noRm: noRm,
                                            faskesUuid: faskesUuid,
                                            statusIgd : {
                                                [Op.eq] : 2
                                            }
                                        },
                                        {
                                            deletedAt: {
                                                [Op.is]: null
                                            }
                                        }
                                    ]
                                },
                                attributes: ["no_reg", "faskes_uuid", "uuid", "status_igd", "tanggal_daftar", "payment_method", "rekam_medis_uuid"],
                                transaction: tr,
                            }
                        ),
                        OrderFisioModel.findAll(
                            {
                                include : [
                                    {
                                        model: PractitionerModel,
                                        as: "practitioner",
                                        required: true,
                                        where: {deletedAt: {[Op.is]: null}},
                                        attributes: ["uuid"],
                                        include: [
                                            {
                                                model: PegawaiModel,
                                                as: "pegawai",
                                                required: true,
                                                where: {deletedAt: {[Op.is]: null}},
                                                attributes: ["title", "nama", "gender"]
                                            }
                                        ]
                                    }
                                ],
                                where: {
                                    [Op.and] : [
                                        {
                                            no_rm: noRm,
                                            faskes_uuid: faskesUuid,
                                            status_fisio : {
                                                [Op.eq] : 5
                                            }
                                        },
                                        {
                                            deletedAt: {
                                                [Op.is]: null
                                            }
                                        }
                                    ]
                                },
                                attributes: ["no_reg", "faskes_uuid", "uuid", "status_fisio", "tanggal_terapi", "payment_method", "rekam_medis_uuid"],
                                transaction: tr,
                            }
                        ),
                    ]
                );

                return {
                    rawatJalan, rawatInap, igd, fisio
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