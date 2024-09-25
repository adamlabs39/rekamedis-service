import FileRepository from "../repositories/file-repository.js";
import ZodValidator from "../validations/zod-validator.js";
import FileValidation from "../validations/file-validation.js";
import NotfoundException from "../errors/notfound-exception.js";
import { z } from "zod";
import {toEpochDate} from "../helpers/date-helper.js";
import PelayananRepository from "../repositories/pelayanan-repository.js";
import Utils from "../helpers/utils.js";
import PelayananValidation from "../validations/pelayanan-validation.js";
import PelayananService from "./pelayanan-service.js";


export default class FileService {
    static async getAll(rekamMedisUuid) {
        ZodValidator.validate(z.string().min(1, "rekam_medis_uuid tidak boleh kosong"), rekamMedisUuid);

        const files = await FileRepository.getAllByRekamMedisUuid(rekamMedisUuid);
        if (files == null || files.length === 0) {
            throw new NotfoundException("File tidak ditemukan");
        }

        return files;
    }

    static async upload(request) {
        ZodValidator.validate(FileValidation.UPLOAD, request);

        if (request.file_type === "surat permohonan rawat inap") {
            await PelayananService.createRiFromSrpi(request);
        }

        return await FileRepository.create(request);
    }

    static async delete(uuid) {
        ZodValidator.validate(z.string().min(1), uuid);

        const affectedRow = await FileRepository.deleteByUuid(uuid);
        if (affectedRow === 0) {
            throw new NotfoundException("File tidak ditemukan");
        }

        return affectedRow;
    }

    static async update(request) {
        ZodValidator.validate(FileValidation.UPDATE, request);

        request.updatedAt = toEpochDate(new Date());
        const affectedRow = await FileRepository.updateByUuid(request);
        if (affectedRow === 0) {
            throw new NotfoundException("File tidak ditemukan");
        }

        return affectedRow;
    }

    static async getLetters(rekamMedisUuid) {
        ZodValidator.validate(z.string().min(1, "rekam_medis_uuid tidak boleh kosong"), rekamMedisUuid);

        const files = await FileRepository.getLetters(rekamMedisUuid);
        if (files == null || files.length === 0) {
            throw new NotfoundException("File tidak ditemukan");
        }

        return files;
    }
}