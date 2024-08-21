import successResponse from "../responses/success-response.js";
import AssessmentService from "../services/assessment-service.js";

export default class AssessmentController {
    static async insert(request, response, nextFunction) {
        try {
            const result = await AssessmentService.insert(request.body);
            response.status(200).json(successResponse("data berhasil dibuat", result));
        } catch (error) {
            nextFunction(error);
        }
    }
}