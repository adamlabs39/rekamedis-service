import {DataTypes, Model} from "sequelize";
import {uuidv7} from "uuidv7";
import sequelizeInstance from "../../configurations/sequelize-instance.js";
import fieldTime from "./common/base-model.js";
import identifierModel from "./common/identifier-model.js";
import HistoryTindakanModel from "./history-tindakan-model.js";

export default class PetugasTindakanModel extends Model {
}
PetugasTindakanModel.init({
        ...identifierModel,
        historyTindakanUuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        practitionerUuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        ...fieldTime
    }, {
        sequelize: sequelizeInstance,
        tableName: "petugas_tindakan",
        className: "PetugasTindakans",
        underscored: true,
        timestamps: false,
        indexes: [
            {
                fields: ['faskes_uuid'],
            }
        ]
    }
)