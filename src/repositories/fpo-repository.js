import FpoPemberianModel from "../models/postgres/fpo-pemberian-model.js";
import {Op} from "sequelize";
import moment from "moment";

export default class FpoRepository {
    static async get(req) {
        const selectedDate = new Date(req.date);

        return await FpoPemberianModel.findAll({
            where : {
                prescription_item_uuid : req.prescription_item_uuid,
                jam_pemberian : {
                    [Op.between] : [
                        moment(selectedDate).startOf('day').valueOf(),
                        moment(selectedDate).endOf('day').valueOf()
                    ]
                },
            },
            attributes: {
                exclude: ['deleted_at', 'created_at', 'updated_at', 'faskes_uuid']
            },
        })
    }
}