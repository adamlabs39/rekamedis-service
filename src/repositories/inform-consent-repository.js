import InformConsentModel from "../models/postgreses/Inform_consent-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";

export default class InformConsentRepository {
    static async create(request) {
        return await sequelizeInstance.transaction(async tr => {
            return await InformConsentModel.create(request, {
                transaction: tr
            });
        });
    }

    static async getAllByRekamMedisUuid(rekamMedisUuid) {
        return await InformConsentModel.findAll({
            where: {
                rekam_medis_uuid: rekamMedisUuid
            }
        });
    }
}