import InstalasiGawatDaruratModel from "../models/postgreses/instalasi-gawat-darurat-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {Op} from "sequelize";
import RawatJalanModel from "../models/postgreses/rawat-jalan-model.js";
import RawatInapModel from "../models/postgreses/rawat-inap-model.js";
import BadRequestException from "../errors/bad-request-exception.js";

export default class PelayananRepository {
    static async updateResume(pelayanan ,data) {
        if (pelayanan === "igd"){
            return await sequelizeInstance.transaction(async tr => {
                return await InstalasiGawatDaruratModel.update(data, {
                    where: {
                        no_reg : data.noReg,
                        deletedAt: {
                            [Op.is]: null
                        },
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        } else if (pelayanan === "rj") {
            return await sequelizeInstance.transaction(async tr => {
                return await RawatJalanModel.update(data, {
                    where: {
                        no_reg : data.noReg,
                        deletedAt: {
                            [Op.is]: null
                        },
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        } else if (pelayanan === "ri") {
            return await sequelizeInstance.transaction(async tr => {
                return await RawatInapModel.update(data, {
                    where: {
                        no_reg : data.noReg,
                        deletedAt: {
                            [Op.is]: null
                        },
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        } else {
            throw new BadRequestException(`Pelayanan ${pelayanan} tidak ada`);
        }
    }

    static async getResume(pelayanan, data) {
        const attributes = [
            "rekam_medis_uuid",
            "edukasi",
            "edukasi_text",
            "kondisi_pasien_pulang",
            "status_pulang",
            "status_pulang_keterangan",
            "tujuan_rujuk",
            "tujuan_rujuk_lainnya",
            "instruksi_no_darurat",
            "transport_rujuk",
            "transport_rujuk_lainnya",
            "is_internal",
            "rujuk_internal",
            "rujuk_eksternal",
            "instruksi_tindak_lanjut",
            "discharge_date",
        ];

        if (pelayanan === "igd") {
            return await InstalasiGawatDaruratModel.findOne({
                where: {
                    no_reg: data.noReg,
                    deletedAt: {
                        [Op.is]: null
                    },
                    faskes_uuid: data.faskesUuid
                },
                attributes : attributes
            });
        } else if (pelayanan === "rj") {
            return await RawatJalanModel.findOne({
                where: {
                    no_reg: data.noReg,
                    deletedAt: {
                        [Op.is]: null
                    },
                    faskes_uuid: data.faskesUuid
                },
                attributes : attributes
            });
        } else if (pelayanan === "ri") {
            return await RawatInapModel.findOne({
                where: {
                    no_reg: data.noReg,
                    deletedAt: {
                        [Op.is]: null
                    },
                    faskes_uuid: data.faskesUuid
                },
                attributes : attributes
            });
        } else {
            throw new BadRequestException(`Pelayanan ${pelayanan} tidak ada`);
        }
    }

    static async dichargeService(pelayanan, data){
        if (pelayanan === "igd") {
            return await sequelizeInstance.transaction(async tr => {
                return await InstalasiGawatDaruratModel.update({statusIgd : 2}, {
                    where: {
                        no_reg : data.noReg,
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        } else if (pelayanan === "rj") {
            return await sequelizeInstance.transaction(async tr => {
                return await RawatJalanModel.update({statusRj : 5}, {
                    where: {
                        no_reg : data.noReg,
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        } else if (pelayanan === "ri") {
            return await sequelizeInstance.transaction(async tr => {
                return await RawatInapModel.update({statusRi : 4}, {
                    where: {
                        no_reg : data.noReg,
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        } else {
            throw new BadRequestException(`Pelayanan ${pelayanan} tidak ada`);
        }
    }
}