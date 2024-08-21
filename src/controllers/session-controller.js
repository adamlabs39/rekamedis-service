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
}