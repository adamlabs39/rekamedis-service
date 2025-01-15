import ZodValidator from "../validations/zod-validator.js";
import RekamMedisValidation from "../validations/rekam-medis-validation.js";
import SessionRepository from "../repositories/session-repository.js";

export default class SessionService {
    static async add(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.ADDSESSION, request);
        const rekamMedis = await SessionRepository.add(validReq.rekam_medis_uuid, validReq.date_order - 1);
        const sessions = rekamMedis.daily_records[validReq.date_order - 1].sessions;
        const data = await SessionRepository.getById(sessions[sessions.length - 1]);

        return {
            data: data,
            is_latest : validReq.date_order === rekamMedis.daily_records.length
        }
    }

    static async delete(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.DELETESESSION, request);

        return await SessionRepository.delete(
            validReq.session_uuid,
            validReq.alasan
        )
    }

    static async getInstruksiMedises(request){
        const validReq = ZodValidator.validate(RekamMedisValidation.GET_INSTRUKSI_MEDISES, request);
        return await SessionRepository.getInstruksiMedises(validReq.session_uuid);
    }

    static async getCatatanPerawat(request){
        const validReq = ZodValidator.validate(RekamMedisValidation.GET_INSTRUKSI_MEDISES, request);
        return await SessionRepository.getCatatanPerawat(validReq.session_uuid);
    }
}