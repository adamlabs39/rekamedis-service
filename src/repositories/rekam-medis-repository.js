import RekamMedisModel from "../models/mongos/rekam-medis-model.js";
import SessionModel from "../models/mongos/session-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {Op} from "sequelize";
import {InstalasiGawatDaruratModel, RawatInapModel, RawatJalanModel} from "@adameds/model-sdk/pelayanan";
import {OrderFisioModel} from "@adameds/model-sdk/rekam-medis";
import {LokasiModel, PegawaiModel, PractitionerModel} from "@adameds/model-sdk/datamaster";

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
        const newSession = new SessionModel();

        await newSession.save();

        const rekamMedis = new RekamMedisModel({
            daily_records: [{sessions: [newSession._id], date : createRequest.date}],
            faskes_uuid: createRequest.faskes_uuid,
            no_reg: createRequest.no_reg,
            no_rm: createRequest.no_rm,
            no_pelayanan : createRequest.no_pelayanan,
            pelayanan : createRequest.pelayanan,
            lokasi_uuid : createRequest.lokasi_uuid
        });

        await rekamMedis.save();


        return rekamMedis;
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
                                                attributes: ["first_title", "name", "gender", "last_title"]
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
                                                attributes: ["first_title","last_title", "name", "gender"]
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
                                                attributes: ["first_title","last_title", "name", "gender"]
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
                                                attributes: ["first_title", "name", "gender", "last_title"]
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