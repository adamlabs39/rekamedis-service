import RekamMedisRepository from "../repositories/rekam-medis-repository.js";
import NotfoundException from "../errors/notfound-exception.js";
import SessionRepository from "../repositories/session-repository.js";
import ZodValidator from "../validations/zod-validator.js";
import RekamMedisValidation from "../validations/rekam-medis-validation.js";

export default class RekamMedisService {
    static async get(request) {
        ZodValidator.validate(RekamMedisValidation.GET, request);

        const rekamMedis = await RekamMedisRepository.get(request);
        if (rekamMedis == null) {
            throw new NotfoundException("Rekam Medis tidak ditemukan");
        }

        const dates = rekamMedis.daily_records.map((daily_record) => {
            return {
                date: daily_record.created_at,
            };
        });

        const date_order = (request.date_order ?? dates.length) - 1;
        const sessions = rekamMedis.daily_records[date_order].sessions;

        const session_order = (request.session_order ?? sessions.length) - 1;
        const data = await SessionRepository.getById(sessions[session_order]._id);

        return {
            dates: dates,
            sessions: sessions,
            data: data,
        }
    }

    static async createNew(request) {
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
            sessions: [{_id: data._id, order: 1}],
            data: data,
            rekam_medis_uuid: rekamMedis._id
        }
    }

    static async addRecord(request){
        const validReq = ZodValidator.validate(RekamMedisValidation.ADDRECORD, request);
        const rekamMedis = await RekamMedisRepository.addRecord(validReq.id);
        const dailyRecords = rekamMedis.daily_records;

        return {
            data : {
                _id : rekamMedis.daily_records[dailyRecords.length -1].sessions[0],
                order : 1,
            }
        }
    }
}