import ZodValidator from "../validations/zod-validator.js";
import RekamMedisValidation from "../validations/rekam-medis-validation.js";
import AssessmentRepository from "../repositories/assessment-repository.js";
import {toEpochDate} from "../helpers/date-helper.js";
import RekamMedisRepository from "../repositories/rekam-medis-repository.js";

export default class AssessmentService {
    static async insert(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.INSERTASSESSMENT, request);

        const session = await AssessmentRepository.insert(validReq.session_id, request.data, validReq.key);

        const rekamMedis = await this.updateSummary(request);
        return {
            data: session,
            summary : rekamMedis?.summary
        }
    }

    static async insertCatatanPerawat(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.INSERTCHAT, request);

        const data = {
            message: validReq.message,
            name: validReq.name,
            user_uuid: validReq.user_uuid,
            time: toEpochDate(new Date())
        }

        return await AssessmentRepository.insertCatatanPerawat(validReq.session_id, data);
    }

    static async insertInstruksiMedis(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.INSERTCHAT, request);

        const data = {
            message: validReq.message,
            name: validReq.name,
            user_uuid: validReq.user_uuid,
            time: toEpochDate(new Date())
        }

        return await AssessmentRepository.insertInstruksiMedis(validReq.session_id, data);
    }

    static async updateInstruksiMedis(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.UPDATECHAT, request);
        return AssessmentRepository.updateInstruksiMedis(validReq.chat_id, {
            message: validReq.message,
        });
    }

    static async updateCatatanPerawat(request) {
        const validReq = ZodValidator.validate(RekamMedisValidation.UPDATECHAT, request);
        return AssessmentRepository.updateCatatanPerawat(validReq.chat_id, {
            message: validReq.message,
        });
    }

    static async updateSummary(request) {
        let data = {
            rekam_medis_uuid: request.rekam_medis_uuid,
            summary: request.data
        }

        if (request.is_latest) {
            if (request.key === 'tanda_vital') {
                if (request.data.tekanan_darah !== null) {
                    data.summary.tekanan_darah = request.data.tekanan_darah;
                }
                if (request.data.frekuensi_nadi !== null) {
                    data.summary.frekuensi_nadi = request.data.frekuensi_nadi;
                }
                if (request.data.frekuensi_nafas !== null) {
                    data.summary.frekuensi_nafas = request.data.frekuensi_nafas;
                }
                if (request.data.suhu !== null) {
                    data.summary.suhu = request.data.suhu;
                }
            } else if (request.key === 'antropometri') {
                if (request.data.tinggi_badan !== null) {
                    data.summary.tinggi_badan = request.data.tinggi_badan;
                }

                if (request.data.berat_badan !== null) {
                    data.summary.berat_badan = request.data.berat_badan;
                }
            } else if (request.key === 'kesadaran') {
                if (request.data.gcs_score !== null) {
                    data.summary.gcs_score = request.data.gcs_score;
                }
            } else if (request.key === 'asesmen_nyeri') {
                if (request.data.skala_nyeri !== null) {
                    data.summary.skala_nyeri = request.data.skala_nyeri;
                }
            } else if (request.key === 'alergi') {
                if (request.data.nama_alergi !== null) {
                    data.summary.nama_alergi = request.data.nama_alergi;
                }
            } else if (request.key === 'anamnesis') {
                if (request.data.keluhan_utama !== null) {
                    data.summary.keluhan_utama = request.data.keluhan_utama;
                }
            } else if (request.key === 'diagnosis_dokter') {
                if (request.data.diagnosis_primer !== null) {
                    data.summary.diagnosis_primer = request.data[0]?.diagnosis;
                }
            }
        }

        if (Object.keys(data.summary).length > 0) {
            return await RekamMedisRepository.updateSummary(data);
        } else {
            return null
        }

    }
}