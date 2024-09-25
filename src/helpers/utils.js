import InstalasiGawatDaruratModel from "../models/postgreses/instalasi-gawat-darurat-model.js";
import RawatInapModel from "../models/postgreses/rawat-inap-model.js";
import RawatJalanModel from "../models/postgreses/rawat-jalan-model.js";
import moment from "moment";
import {Op} from "sequelize";

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
}