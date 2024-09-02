import ZodValidator from "../validations/zod-validator.js";
import RekamMedisValidation from "../validations/rekam-medis-validation.js";
import AssessmentRepository from "../repositories/assessment-repository.js";
import {toEpochDate} from "../helpers/date-helper.js";

export default class AssessmentService {
    static async insert(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.INSERTASSESSMENT, request);

        const session = await AssessmentRepository.insert(validReq.session_id, request.data ,validReq.key);

        console.log(request.data)
        return {
            data: session
        }
    }

    static async insertCatatanPerawat(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.INSERTCHAT, request);

        const data = {
            message: validReq.message,
            name: validReq.name,
            user_uuid: validReq.user_uuid,
            time : toEpochDate(new Date())
        }

        return await AssessmentRepository.insertCatatanPerawat(validReq.session_id, data);
    }

    static async insertInstruksiMedis(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.INSERTCHAT, request);

        const data = {
            message: validReq.message,
            name: validReq.name,
            user_uuid: validReq.user_uuid,
            time : toEpochDate(new Date())
        }

        return await AssessmentRepository.insertInstruksiMedis(validReq.session_id, data);
    }

    static async updateInstruksiMedis(request){
        const validReq = ZodValidator.validate(RekamMedisValidation.UPDATECHAT, request);
        return AssessmentRepository.updateInstruksiMedis(validReq.chat_id, {
            message: validReq.message,
        });
    }

    static async updateCatatanPerawat(request){
        const validReq = ZodValidator.validate(RekamMedisValidation.UPDATECHAT, request);
        return AssessmentRepository.updateCatatanPerawat(validReq.chat_id, {
            message: validReq.message,
        });
    }
}