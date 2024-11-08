import sequelizeInstance from "../configurations/sequelize-instance.js";
import {FaskesModel} from "@adameds/model-sdk/datamaster";
import {FaskesProfilesModel} from "@adameds/model-sdk/setting";

export default class FaskesRepository {
    static async getByUuid(uuid) {
        return await FaskesModel.findOne({
            where: {
                uuid: uuid
            }
        });
    }

    static async getProfile(faskes_uuid){
        return await sequelizeInstance.transaction(async tr => {
            return await FaskesProfilesModel.findOne({
                where: {
                    faskesUuid: faskes_uuid
                },
                transaction: tr
            });
        });
    }

}