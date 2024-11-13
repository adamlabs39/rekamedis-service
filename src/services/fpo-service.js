import ZodValidator from "../validations/zod-validator.js";
import FpoValidation from "../validations/fpo-validation.js";
import FpoRepository from "../repositories/fpo-repository.js";
import sequelizeInstance from "@adameds/model-sdk/instance";
import BadRequestException from "../errors/bad-request-exception.js";

export default class FpoService {
    static async get(req){
        await ZodValidator.validate(FpoValidation.GET, req);

        return await FpoRepository.get(req);
    }

    static async insert(req){
        const transaction = await sequelizeInstance.transaction();

        await ZodValidator.validate(FpoValidation.INSERT, req);

        const sisaQty = await FpoRepository.getSisaQtyOrder(req.prescription_item_uuid);
        if(sisaQty.sisa_qty_order <= 0){
            throw new BadRequestException("obat tidak mencukupi");
        }

        try {
            const result = await FpoRepository.insert(req, transaction);
            await FpoRepository.reduceItem(req, transaction);

            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async update(req){
        const transaction = await sequelizeInstance.transaction();

        if (req.fpo === undefined) {
            throw new BadRequestException("fpo tidak ditemukan");
        }

        if (req.fpo.length === 0) {
            throw new BadRequestException("fpo tidak ditemukan");
        }

        try {
            for (const item of req.fpo) {
                await ZodValidator.validate(FpoValidation.UPDATE, item);
                await FpoRepository.update(item, transaction);
            }

            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }
}