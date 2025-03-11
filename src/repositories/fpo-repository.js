import FpoPemberianModel from "../models/postgres/fpo-pemberian-model.js";
import {Op} from "sequelize";
import moment from "moment";
import PrescriptionItemModel from "../models/postgres/prescription-item-model.js";
import BadRequestException from "../errors/bad-request-exception.js";

export default class FpoRepository {
    static async get(req) {
        const selectedDate = new Date(req.date);

        return await FpoPemberianModel.findAll({
            where: {
                prescription_item_uuid: req.prescription_item_uuid,
                jam_pemberian: {
                    [Op.between]: [
                        moment(selectedDate).startOf('day').unix(),
                        moment(selectedDate).endOf('day').unix()
                    ]
                },
            },
            attributes: {
                exclude: ['deleted_at', 'created_at', 'updated_at', 'faskes_uuid']
            },
        })
    }

    static async insert(req, transaction) {
        await FpoPemberianModel.create(req, {transaction});
    }

    static async update(req, transaction) {
        const [affectedRow] =  await FpoPemberianModel.update(req, {
            where: {
                uuid: req.uuid
            },
            transaction
        })

        return affectedRow;
    }

    static async reduceItem(req, transaction) {
        await PrescriptionItemModel.update({
            sisa_qty_order: PrescriptionItemModel.sequelize.literal(`sisa_qty_order - 1`)
        }, {
            where: {
                uuid: req.prescription_item_uuid
            },
            transaction
        })
    }

    static async getSisaQtyOrder(prescriptionItemUuid) {
        return await PrescriptionItemModel.findOne({
            where: {
                uuid: prescriptionItemUuid
            },
            attributes: ['sisa_qty_order']
        })
    }
}