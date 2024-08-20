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
}