import moment from "moment";
import {Op} from "sequelize";
import BadRequestException from "../errors/bad-request-exception.js";
import {InstalasiGawatDaruratModel, RawatInapModel, RawatJalanModel} from "@adameds/model-sdk/pelayanan";

export default class Utils {
    static camelToSnakeObject(obj, exclude = []) {
        const newObj = {};

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {

                if(exclude.includes(key)){
                    newObj[key] = obj[key];
                    continue;
                }

                const snakeCaseKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
                newObj[snakeCaseKey] = obj[key];
            }
        }

        return newObj;
    }

    static snakeToCamelObject(obj) {
        const newObj = {};

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const camelCaseKey = key.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
                newObj[camelCaseKey] = obj[key];
            }
        }

        return newObj;
    }

    static generateNoPelayanan = async (service, faskesUuid) => {
        const today = moment().format('YYMMDD');
        const { model, prefix } = {
            'IGD': { model: InstalasiGawatDaruratModel, prefix: 'IGD' },
            'RI': { model: RawatInapModel, prefix: 'RI' },
            'RJ': { model: RawatJalanModel, prefix: 'RJ' }
        }[service] || {};

        if (!model) throw new Error('Service not found');

        const count = await model.count({
            where: { faskesUuid, createdAt: { [Op.between]: [today, today + 86400] } }
        });

        return `${prefix}${today}${(count + 1).toString().padStart(4, '0')}`;
    };

    static generateCodeFileType = async (surat) => {
        switch (surat) {
            case 'surat_kontrol_rawat_jalan':
                return 'K';
            case 'surat_permohonan_rawat_inap':
                return 'R';
            case 'surat_keterangan_sakit':
                return 'S';
            case 'surat_keterangan_sehat':
                return 'H';
            case 'surat_rujuk_keluar_faskes':
                return 'J';
            case 'surat_keterangan_meninggal':
                return 'M';
            case 'resep_kacamata':
                return 'T';
            default:
                throw new BadRequestException('Tipe surat tidak ada');
        }
    }
}