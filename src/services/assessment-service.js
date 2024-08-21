import ZodValidator from "../validations/zod-validator.js";
import RekamMedisValidation from "../validations/rekam-medis-validation.js";
import AssessmentRepository from "../repositories/assessment-repository.js";

export default class AssessmentService {
    static async insert(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.INSERTASSESSMENT, request);

        const session = await AssessmentRepository.insert(validReq.session_id, request.data ,validReq.key);

        console.log(request.data)
        return {
            data: session
        }
    }

}