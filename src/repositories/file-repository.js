import sequelizeInstance from "../configurations/sequelize-instance.js";
import FileModel from "../models/postgreses/file-model.js";

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
                rekam_medis_uuid: rekamMedisUuid
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
                    uuid: request.uuid
                },
                transaction: tr
            });

            return affectedRow[0];
        });
    }
}