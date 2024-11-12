import ZodValidator from "../validations/zod-validator.js";
import FpoValidation from "../validations/fpo-validation.js";
import FpoRepository from "../repositories/fpo-repository.js";

export default class FpoService {
    static async get(req){
        await ZodValidator.validate(FpoValidation.GET, req);

        return await FpoRepository.get(req);
    }
}