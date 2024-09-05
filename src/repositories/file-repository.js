import sequelizeInstance from "../configurations/sequelize-instance.js";
import FileModel from "../models/postgreses/file-model.js";
import {Op} from "sequelize";

export default class FileRepository {
    static async create(request) {
        return await sequelizeInstance.transaction(async tr => {
            return await FileModel.create(request, {
                transaction: tr
            });
        });
    }

    static async getAllByRekamMedisUuid(rekamMedisUuid) {
        return await FileModel.findAll({
            where: {
                rekam_medis_uuid: rekamMedisUuid,
                file_type: 'berkas'
            }
        });
    }

    static async getLetters(rekamMedisUuid) {
        return await FileModel.findAll({
            where: {
                rekam_medis_uuid: rekamMedisUuid,
                file_type: {
                    [Op.not]: 'berkas'
                }
            }
        });
    }

    static async deleteByUuid(uuid) {
        return await FileModel.destroy({
            where: {
                uuid: uuid
            }
        });
    }

    static async updateByUuid(request) {
        return await sequelizeInstance.transaction(async tr => {
            let affectedRow = await FileModel.update(request, {
                where: {
                    uuid: request.file_uuid
                },
                transaction: tr
            });

            return affectedRow[0];
        });
    }
}