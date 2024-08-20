import RekamMedisRepository from "../repositories/rekam-medis-repository.js";
import NotfoundException from "../errors/notfound-exception.js";
import SessionRepository from "../repositories/session-repository.js";
import ZodValidator from "../validations/zod-validator.js";
import RekamMedisValidation from "../validations/rekam-medis-validation.js";

export default class RekamMedisService {
    static async get(request) {
        ZodValidator.validate(RekamMedisValidation.GET,request);

        const date_order = (request.date_order ?? 1) - 1;
        const session_order = (request.session_order ?? 1) - 1;

        const rekamMedis = await RekamMedisRepository.get(request);
        if (rekamMedis == null) {
            throw new NotfoundException("Rekam Medis tidak ditemukan");
        }

        const dates = rekamMedis.daily_records.map((daily_record) => {
            return {
                date: daily_record.created_at,
            };
        });

        const sessions = rekamMedis.daily_records[date_order].sessions;

        const data = await SessionRepository.getById(sessions[session_order]._id);

        return {
            dates: dates,
            sessions: sessions,
            data: data,
        }
    }

    static async createNew(request){
        const rekamMedis = await RekamMedisRepository.createNew(request);

        const dates = rekamMedis.daily_records.map((daily_record) => {
            return {
                date: daily_record.created_at,
            };
        });

        const sessions = rekamMedis.daily_records[0].sessions;

        const data = await SessionRepository.getById(sessions[0]._id);

        return {
            dates: dates,
            sessions: [{_id : data._id, order : 1}],
            data: data,
            rekam_medis_uuid : rekamMedis._id
        }
    }

    static async addSession(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.ADDSESSION, request);
        const rekamMedis = await SessionRepository.add(validReq.rekam_medis_uuid, validReq.date_order, validReq.sesi);

        const sessions = rekamMedis.daily_records[validReq.date_order].sessions;
        const data = await SessionRepository.getById(sessions[sessions.length - 1]);

        return {
            data: data,
        }
    }
}