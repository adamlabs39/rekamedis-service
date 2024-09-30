import FileRepository from "../repositories/file-repository.js";
import ZodValidator from "../validations/zod-validator.js";
import FileValidation from "../validations/file-validation.js";
import NotfoundException from "../errors/notfound-exception.js";
import { z } from "zod";
import {toEpochDate} from "../helpers/date-helper.js";
import Utils from "../helpers/utils.js";
import PelayananService from "./pelayanan-service.js";
import FaskesRepository from "../repositories/faskes-repository.js";


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

        if (request.file_type !== "berkas") {
            ZodValidator.validate(FileValidation.NOMOR_SURAT, request);
        }

        if (request.file_type === "surat_permohonan_rawat_inap") {
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


    static async generateCode(request) {
        ZodValidator.validate(FileValidation.GENERATE_CODE, request);

        let fileTypeKey;
        let orderCode;
        let provinceCode;
        let districtCode;
        let monthCode;
        let faskesCode;
        let yearCode;

        fileTypeKey = await Utils.generateCodeFileType(request.file_type);
        const lastLetter = await FileRepository.getLastLetterByType(request.faskes_uuid, request.file_type);

        if (lastLetter == null) {
            orderCode = "001";
        } else {
            orderCode = (parseInt(lastLetter.dataValues.nomor_surat.slice(-3)) + 1).toString().padStart(3, "0");
        }

        const faskes = await FaskesRepository.getByUuid(request.faskes_uuid);
        if (faskes == null) {
            throw new NotfoundException("Faskes tidak ditemukan");
        } else {
            faskesCode = faskes.dataValues.code;
        }

        const now = new Date();
        monthCode = (now.getMonth() + 1).toString().padStart(2, "0");
        yearCode = now.getFullYear().toString().slice(-2);

        const faskesProfile = await FaskesRepository.getProfile(request.faskes_uuid);
        if (faskesProfile == null) {
            throw new NotfoundException("Profile Faskes tidak ditemukan");
        } else {
            provinceCode = faskesProfile.dataValues.codeProvinsi;
            districtCode = faskesProfile.dataValues.codeKabupaten;
        }

        return {
            "data" : `${provinceCode}${districtCode}${faskesCode}${monthCode}${yearCode}${fileTypeKey}${orderCode}`
        };
    }
}