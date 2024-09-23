import RekamMedisRepository from "../repositories/rekam-medis-repository.js";
import NotfoundException from "../errors/notfound-exception.js";
import SessionRepository from "../repositories/session-repository.js";
import ZodValidator from "../validations/zod-validator.js";
import RekamMedisValidation from "../validations/rekam-medis-validation.js";
import PelayananRepository from "../repositories/pelayanan-repository.js";

export default class RekamMedisService {
    static async get(request) {
        ZodValidator.validate(RekamMedisValidation.GET, request);

        const rekamMedis = await RekamMedisRepository.get(request);
        if (rekamMedis == null) {
            throw new NotfoundException("Rekam Medis tidak ditemukan");
        }

        const dates = rekamMedis.daily_records.map((daily_record, index) => {
            return {
                date: daily_record.date,
                is_selected : ((request.date_order ?? rekamMedis.daily_records.length) - 1)  === index
            };
        });

        let date_order = request.date_order ?? dates.length;
        if (date_order > dates.length) {
            throw new NotfoundException("tanggal tidak ada");
        }
        date_order--;

        let sessions = rekamMedis.daily_records[date_order].sessions;

        let session_order = request.session_order ?? sessions.length;
        if (session_order > sessions.length) {
            throw new NotfoundException("sesi tidak ada");
        }
        session_order--;

        const data = await SessionRepository.getById(sessions[session_order]._id);

        sessions = sessions.map((session, index) => {
            return {
                id : session._id,
                order : index + 1,
                is_selected : index === session_order
            }
        });

        return {
            dates: dates,
            sessions: sessions,
            data: data,
            summary : rekamMedis.summary,
            is_latest : (++session_order === sessions.length) && (++date_order === dates.length)
        }
    }

    static async createNew(request) {
        ZodValidator.validate(RekamMedisValidation.CREATENEW, request);

        const rekamMedis = await RekamMedisRepository.createNew(request);

        const dates = rekamMedis.daily_records.map((daily_record) => {
            return {
                date: daily_record.date,
                is_selected : true
            };
        });

        let sessions = rekamMedis.daily_records[0].sessions;

        const data = await SessionRepository.getById(sessions[0]._id);

        sessions = sessions.map((session, index) => {
            return {
                id : session._id,
                order : index + 1,
                is_selected : true
            }
        });

        await PelayananRepository.insertRekamMedis(request.pelayanan, {
            rekamMedisUuid: rekamMedis._id.toString(),
            noPelayanan: request.no_pelayanan,
            faskesUuid: request.faskes_uuid
        })

        return {
            dates: dates,
            sessions: sessions,
            data: data,
            rekam_medis_uuid: rekamMedis._id,
            summary : rekamMedis.summary,
            is_latest : true
        }
    }

    static async addRecord(request){
        const validReq = ZodValidator.validate(RekamMedisValidation.ADDRECORD, request);
        const rekamMedis = await RekamMedisRepository.addRecord(validReq.rekam_medis_uuid, validReq.date);
        const dailyRecords = rekamMedis.daily_records;

        const dates = dailyRecords.map((daily_record) => {
            return {
                date: daily_record.date,
                is_selected : daily_record.date === validReq.date
            };
        });

        return {
            dates: dates,
            sessions: [{id: dailyRecords[dailyRecords.length -1].sessions[0], order: 1, is_selected : true}],
            data : {
                _id : rekamMedis.daily_records[dailyRecords.length -1].sessions[0],
                order : 1,
            },
            summary : rekamMedis.summary,
            is_latest : true
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