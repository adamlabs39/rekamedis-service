import RekamMedisService from "../services/rekam-medis-service.js";
import successResponse from "../responses/success-response.js";

export default class RekamMedisController {
    static async get(request, response, nextFunction) {
        try {
            request.query.faskes_uuid = response.locals.jwtData.faskesUuid;
            const result = await RekamMedisService.get(request.query);
            response.status(200).json(successResponse("data berhasil didapat", result));
        } catch (error) {
            nextFunction(error);
        }
    }
}