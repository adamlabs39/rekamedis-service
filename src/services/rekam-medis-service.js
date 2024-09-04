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

        let date_order = request.date_order ?? dates.length;
        if (date_order > dates.length) {
            throw new NotfoundException("tanggal tidak ada");
        }
        date_order--;

        const sessions = rekamMedis.daily_records[date_order].sessions;

        let session_order = request.session_order ?? sessions.length;
        if (session_order > sessions.length) {
            throw new NotfoundException("sesi tidak ada");
        }
        session_order--;

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

        const dates = dailyRecords.map((daily_record) => {
            return {
                date: daily_record.created_at,
            };
        });

        return {
            dates: dates,
            sessions: [{_id: dailyRecords[dailyRecords.length -1].sessions[0], order: 1}],
            data : {
                _id : rekamMedis.daily_records[dailyRecords.length -1].sessions[0],
                order : 1,
            }
        }
    }

    static async getHistory(req) {
        const validReq = ZodValidator.validate(RekamMedisValidation.GETHISTORY, req);
        const history = await RekamMedisRepository.getHistory(validReq.no_rm, validReq.faskes_uuid);

        const combinedHistory = [
            ...history.rawatJalan,
            ...history.rawatInap,
            ...history.igd
        ];

        combinedHistory.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

        return combinedHistory
    }
}