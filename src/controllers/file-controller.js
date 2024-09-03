import successResponse from "../responses/success-response.js";
import FileService from "../services/file-service.js";

export default class FileController {
    static async getAll(request, response, nextFunction) {
        try {
            const result = await FileService.getAll(request.query.rekam_medis_uuid);
            response.status(200).json(successResponse("data berhasil didapat", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async upload(request, response, nextFunction) {
        try {
            request.body.faskes_uuid = response.locals.jwtData.faskesUuid;
            const result = await FileService.upload(request.body);
            response.status(200).json(successResponse("data berhasil dibuat", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async delete(request, response, nextFunction) {
        try {
            const result = await FileService.delete(request.body.uuid);
            response.status(200).json(successResponse("data berhasil dihapus"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async update(request, response, nextFunction) {
        try {
            const result = await FileService.update(request.body);
            response.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }
}