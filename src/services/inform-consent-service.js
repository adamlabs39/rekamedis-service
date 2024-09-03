import ZodValidator from "../validations/zod-validator.js";
import InformConsentValidation from "../validations/inform-consent-validation.js";
import InformConsentRepository from "../repositories/inform-consent-repository.js";
import {z} from "zod";
import NotfoundException from "../errors/notfound-exception.js";

export default class InformConsentService {
    static async create(request) {
        const validData = ZodValidator.validate(InformConsentValidation.CREATE, request);

        return await InformConsentRepository.create(validData);
    }

    static async getAllByRekamMedisUuid(rekamMedisUuid) {
        ZodValidator.validate(z.string().min(1, "rekam_medis_uuid tidak boleh kosong"), rekamMedisUuid);

        const data = await InformConsentRepository.getAllByRekamMedisUuid(rekamMedisUuid);

        if (data == null || data.length === 0) {
            throw new NotfoundException("Data tidak ditemukan");
        }

        return data;
    }
}