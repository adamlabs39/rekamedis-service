import FpoService from "../services/fpo-service.js";
import successResponse from "../responses/success-response.js";

export default class FpoController {
    static async get(request, response, nextFunction) {
        try {
            const result = await FpoService.get(request.query);
            response.status(200).json(successResponse("data berhasil didapat", result));
        } catch (error) {
            nextFunction(error);
        }
    }
}