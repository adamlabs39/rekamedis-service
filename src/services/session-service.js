import ZodValidator from "../validations/zod-validator.js";
import RekamMedisValidation from "../validations/rekam-medis-validation.js";
import SessionRepository from "../repositories/session-repository.js";

export default class SessionService {
    static async add(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.ADDSESSION, request);
        const rekamMedis = await SessionRepository.add(validReq.rekam_medis_uuid, validReq.date_order - 1, validReq.sesi);

        const sessions = rekamMedis.daily_records[validReq.date_order].sessions;
        const data = await SessionRepository.getById(sessions[sessions.length - 1]);

        return {
            data: data,
            is_latest : validReq.date_order === rekamMedis.daily_records.length
        }
    }

    static async delete(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.DELETESESSION, request);

        return await SessionRepository.delete(
            validReq.id,
            validReq.alasan
        )
    }
}