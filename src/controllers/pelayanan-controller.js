import successResponse from "../responses/success-response.js";
import PelayananService from "../services/pelayanan-service.js";

export default class PelayananController {
    static async updateResume(request, response, nextFunction) {
        try {
            request.body.faskes_uuid = response.locals.jwtData.faskesUuid;
            const result = await PelayananService.updateResume(request.body);
            response.status(200).json(successResponse("data berhasil diupdate", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async getResume(request, response, nextFunction) {
        try {
            request.query.faskes_uuid = response.locals.jwtData.faskesUuid;
            const result = await PelayananService.getResume(request.query);
            response.status(200).json(successResponse("data berhasil ditemukan", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async dischargeService(request, response, nextFunction) {
        try {
            request.body.faskes_uuid = response.locals.jwtData.faskesUuid;
            const result = await PelayananService.dischargeService(request.body);
            response.status(200).json(successResponse("data berhasil diupdate", result));
        } catch (error) {
            nextFunction(error);
        }
    }
}