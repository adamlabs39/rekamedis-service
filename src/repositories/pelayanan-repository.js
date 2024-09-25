import InstalasiGawatDaruratModel from "../models/postgreses/instalasi-gawat-darurat-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {Op} from "sequelize";
import RawatJalanModel from "../models/postgreses/rawat-jalan-model.js";
import RawatInapModel from "../models/postgreses/rawat-inap-model.js";
import BadRequestException from "../errors/bad-request-exception.js";
import HistoryTindakanModel from "../models/postgreses/history-tindakan-model.js";
import PetugasTindakanModel from "../models/postgreses/petugas-tindakan-model.js";
import OrderFisioModel from "../models/postgreses/order-fisio-model.js";
import Utils from "../helpers/utils.js";

export default class PelayananRepository {
    static async updateResume(pelayanan ,data) {
        if (pelayanan === "igd"){
            return await sequelizeInstance.transaction(async tr => {
                return await InstalasiGawatDaruratModel.update(data, {
                    where: {
                        rekam_medis_uuid : data.rekamMedisUuid,
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
                        rekam_medis_uuid : data.rekamMedisUuid,
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
                        rekam_medis_uuid : data.rekamMedisUuid,
                        deletedAt: {
                            [Op.is]: null
                        },
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        }else if (pelayanan === "fisio") {
            return await sequelizeInstance.transaction(async tr => {
                return await OrderFisioModel.update(Utils.camelToSnakeObject(data), {
                    where: {
                        rekam_medis_uuid : data.rekamMedisUuid,
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
                    rekam_medis_uuid: data.rekamMedisUuid,
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
                    rekam_medis_uuid: data.rekamMedisUuid,
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
                    rekam_medis_uuid: data.rekamMedisUuid,
                    deletedAt: {
                        [Op.is]: null
                    },
                    faskes_uuid: data.faskesUuid
                },
                attributes : attributes
            });
        } else if (pelayanan === "fisio") {
            attributes.push(...["fase_rehabilitasi", "prognosis"]);
            return await OrderFisioModel.findOne({
                where: {
                    rekam_medis_uuid: data.rekamMedisUuid,
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
                        rekam_medis_uuid : data.rekamMedisUuid,
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        } else if (pelayanan === "rj") {
            return await sequelizeInstance.transaction(async tr => {
                return await RawatJalanModel.update({statusRj : 5}, {
                    where: {
                        rekam_medis_uuid : data.rekamMedisUuid,
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        } else if (pelayanan === "ri") {
            return await sequelizeInstance.transaction(async tr => {
                return await RawatInapModel.update({statusRi : 4}, {
                    where: {
                        rekam_medis_uuid : data.rekamMedisUuid,
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        }else if (pelayanan === "fisio") {
            return await sequelizeInstance.transaction(async tr => {
                return await OrderFisioModel.update({status_fisio : 5}, {
                    where: {
                        rekam_medis_uuid : data.rekamMedisUuid,
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        } else {
            throw new BadRequestException(`Pelayanan ${pelayanan} tidak ada`);
        }
    }

    static async insertRekamMedis(pelayanan, data){
        if (pelayanan === "igd") {
            return await sequelizeInstance.transaction(async tr => {
                return await InstalasiGawatDaruratModel.update({rekamMedisUuid : data.rekamMedisUuid}, {
                    where: {
                        no_pelayanan : data.noPelayanan,
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        } else if (pelayanan === "rj") {
            return await sequelizeInstance.transaction(async tr => {
                return await RawatJalanModel.update({rekamMedisUuid : data.rekamMedisUuid}, {
                    where: {
                        no_pelayanan : data.noPelayanan,
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        } else if (pelayanan === "ri") {
            return await sequelizeInstance.transaction(async tr => {
                return await RawatInapModel.update({rekamMedisUuid : data.rekamMedisUuid}, {
                    where: {
                        no_pelayanan : data.noPelayanan,
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        } else if (pelayanan === "fisio") {
            return await sequelizeInstance.transaction(async tr => {
                return await OrderFisioModel.update({rekam_medis_uuid : data.rekamMedisUuid}, {
                    where: {
                        no_order : data.noPelayanan,
                        faskes_uuid: data.faskesUuid
                    },
                    transaction: tr
                });
            });
        }else {
            throw new BadRequestException(`Pelayanan ${pelayanan} tidak ada`);
        }
    }

    static async insertHistory(histories, petugas) {
        return await sequelizeInstance.transaction(
            async tr => {
                await HistoryTindakanModel.bulkCreate(histories, {transaction: tr});
                await PetugasTindakanModel.bulkCreate(petugas, {transaction: tr});
            }
        )
    }

    static async getPelayanan(pelayanan, rekam_medis_uuid) {
        if (pelayanan === "igd") {
            return await InstalasiGawatDaruratModel.findOne({
                where: {
                    rekamMedisUuid: rekam_medis_uuid,
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });
        } else if (pelayanan === "rj") {
            return await RawatJalanModel.findOne({
                where: {
                    rekamMedisUuid: rekam_medis_uuid,
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });
        } else {
            throw new BadRequestException(`Pelayanan ${pelayanan} tidak ada`);
        }
    }

    static async createRawatInap(data) {
        return await sequelizeInstance.transaction(async tr => {
            return await RawatInapModel.create(data, {
                transaction: tr
            });
        });
    }
}