import ZodValidator from "../validations/zod-validator.js";
import PelayananValidation from "../validations/pelayanan-validation.js";
import PelayananRepository from "../repositories/pelayanan-repository.js";
import InternalServerException from "../errors/internal-server-exception.js";
import Utils from "../helpers/utils.js";
import RekamMedisRepository from "../repositories/rekam-medis-repository.js";

export default class PelayananService {
    static async updateResume(request) {
        ZodValidator.validate(PelayananValidation.BEFOREUPDATE, request);

        if (request.status_pulang === "other-hcf") {
            ZodValidator.validate(PelayananValidation.UPDATEDIRUJUK, request);
        } else if (request.status_pulang === "oth") {
            ZodValidator.validate(PelayananValidation.UPDATELAINNYA, request);
        }

        const { pelayanan, ...requestWithoutPelayanan } = request;
        const affectedRow = await PelayananRepository.updateResume(request.pelayanan , Utils.snakeToCamelObject(requestWithoutPelayanan));

        if (affectedRow[0] === 0) {
            throw new InternalServerException("Pelayanan tidak berhasil di update");
        } else {
            return {message: `berhasil mengupdate resume medis`}
        }
    }

    static async getResume(request) {
        ZodValidator.validate(PelayananValidation.GET, request);

        const resume = await PelayananRepository.getResume(request.pelayanan, Utils.snakeToCamelObject(request));
        if (!resume) {
            throw new InternalServerException("Resume medis tidak ditemukan");
        }

        const rekamMedis = await RekamMedisRepository.get({rekam_medis_uuid: resume.dataValues.rekam_medis_uuid})
        if (rekamMedis === null){
            throw new InternalServerException("Rekam medis tidak ditemukan");
        }

        resume.anamnesis = rekamMedis.summary.anamnesis;

        return resume;
    }

    static async dischargeService(request) {
        ZodValidator.validate(PelayananValidation.GET, request);

        const affectedRow = await PelayananRepository.dichargeService(request.pelayanan , Utils.snakeToCamelObject(request));

        if (affectedRow[0] === 0) {
            throw new InternalServerException("Pelayanan tidak berhasil di discharge");
        } else {
            return {message: `berhasil discharge resume medis`}
        }
    }
}