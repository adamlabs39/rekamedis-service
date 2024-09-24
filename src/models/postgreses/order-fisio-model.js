import {DataTypes, Model} from "sequelize";
import {uuidv7} from "uuidv7";
import sequelizeInstance from "../../configurations/sequelize-instance.js";
import fieldTime from "./common/base-model.js";
import PractitionerModel from "./practitioner-model.js";
import RawatJalanModel from "./rawat-jalan-model.js";

export default class OrderFisioModel extends Model {
}
OrderFisioModel.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            defaultValue: () => uuidv7()
        },
        faskes_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    no_order : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    no_reg : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    patient_uuid : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    no_rm : {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    rekam_medis_fisio_uuid : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    rekam_medis_pelayanan_uuid : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    rekam_medis_pelayanan_date : {
        type: DataTypes.DATE,
        allowNull: false,
    },
    payment_method : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    asuransi_uuid : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    pelayanan : {
        type: DataTypes.ENUM('rajal', 'ranap', 'igd', 'aps'),
        allowNull: false,
    },
    lokasi_uuid : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    dokter_pengirim_uuid : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    pasien_maternitas : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    keluhan_utama : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    catatan : {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    diagnosis : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    tanggal_terapi : {
        type: DataTypes.DATE,
        allowNull: false,
    },
    jenis_fisio : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    petugas_order : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    status_fisio : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bed_ruangan_uuid : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    jam_terapi : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    petugas_fisio : {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    fase_rehabilitasi : {
        type: DataTypes.INTEGER,
    },
    edukasi : {
        type: DataTypes.STRING(255),
    },
    edukasi_text : {
        type: DataTypes.TEXT,
    },
    prognosis : {
        type: DataTypes.STRING(255),
    },
    kondisi_pasien_pulang : {
        type: DataTypes.STRING(255),
    },
    status_pulang : {
        type: DataTypes.STRING(255),
    },
    ...fieldTime
    }, {
        sequelize: sequelizeInstance,
        tableName: "order_fisio",
        underscored: true,
        timestamps: false,
    }
)

OrderFisioModel.belongsTo(PractitionerModel,{
    foreignKey: "dokter_pengirim_uuid",
    as: "practitioner",
    constraints: false,
})