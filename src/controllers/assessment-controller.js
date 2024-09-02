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

    static async insertCatatanPerawat(request, response, nextFunction) {
        try {
            request.body.user_uuid = response.locals.jwtData.userUuid;
            request.body.name = response.locals.jwtData.username;
            const result = await AssessmentService.insertCatatanPerawat(request.body);
            response.status(200).json(successResponse("data berhasil dibuat", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async insertInstruksiMedis(request, response, nextFunction) {
        try {
            const result = await AssessmentService.insertInstruksiMedis(request.body);
            response.status(200).json(successResponse("data berhasil dibuat", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async updateInstruksiMedis(request, response, nextFunction) {
        try {
            const result = await AssessmentService.updateInstruksiMedis(request.body);
            response.status(200).json(successResponse("data berhasil diupdate", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async updateCatatanPerawat(request, response, nextFunction) {
        try {
            const result = await AssessmentService.updateCatatanPerawat(request.body);
            response.status(200).json(successResponse("data berhasil diupdate", result));
        } catch (error) {
            nextFunction(error);
        }
    }
}