import SessionService from "../services/session-service.js";
import successResponse from "../responses/success-response.js";

export default class SessionController {
    static async create(request, response, nextFunction) {
        try {
            const result = await SessionService.add(request.body);
            response.status(200).json(successResponse("data berhasil dibuat", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async delete(request, response, nextFunction) {
        try {
            const result = await SessionService.delete(request.body);
            response.status(200).json(successResponse("data berhasil dihapus", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async getInstruksiMedises(request, response, nextFunction){
        try {
            // request.body.user_uuid = request.author.userUuid;
            // TODO : BRING BACK DYNAMIC USER_UUID
            request.query.user_uuid = "0192b31f-365d-731c-8b16-3a4565c9475e";
            const result = await SessionService.getInstruksiMedises(request.query);
            response.status(200).json(successResponse("data berhasil didapat", result));
        } catch (error){
            nextFunction(error);
        }
    }

    static async getCatatanPerawat(request, response, nextFunction){
        try {
            // request.body.user_uuid = request.author.userUuid;
            // TODO : BRING BACK DYNAMIC USER_UUID
            request.query.user_uuid = "0192b31f-365d-731c-8b16-3a4565c9475e";
            const result = await SessionService.getCatatanPerawat(request.query);
            response.status(200).json(successResponse("data berhasil didapat", result));
        } catch (error){
            nextFunction(error);
        }
    }
}