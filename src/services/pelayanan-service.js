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

        let tindakans = [];

        const resume = await PelayananRepository.getResume(request.pelayanan, Utils.snakeToCamelObject(request));
        if (!resume) {
            throw new InternalServerException("Resume medis tidak ditemukan");
        }

        const rekamMedis = await RekamMedisRepository.getResumeNeed({rekam_medis_uuid: resume.dataValues.rekam_medis_uuid})

        if (rekamMedis === null){
            throw new InternalServerException("Rekam medis tidak ditemukan");
        }


        rekamMedis.daily_records.forEach((daily_record) => {
            const sessions = daily_record.sessions ?? [];
            sessions.forEach((session) => {
                const pemeriksaan_tindakan = session.pemeriksaan_tindakan ?? [];

                if (pemeriksaan_tindakan?.length !== 0) {
                    pemeriksaan_tindakan.forEach((tindakan_item) => {
                        tindakans.push(tindakan_item);
                    })
                }
            })
        })

        resume.dataValues.tanda_vital_pulang = {
            tekanan_darah : rekamMedis.summary.tekanan_darah,
            frekuensi_nadi : rekamMedis.summary.frekuensi_nadi,
            frekuensi_nafas : rekamMedis.summary.frekuensi_nafas,
            suhu : rekamMedis.summary.suhu,
        };

        resume.dataValues.pemeriksaan_tindakan = tindakans;

        resume.dataValues.tanda_vital_awal = {
            tekanan_darah : rekamMedis.daily_records[0]?.sessions[0]?.tanda_vital?.tekanan_darah,
            frekuensi_nadi : rekamMedis.daily_records[0]?.sessions[0]?.tanda_vital?.frekuensi_nadi,
            frekuensi_nafas : rekamMedis.daily_records[0]?.sessions[0]?.tanda_vital?.frekuensi_nafas,
            suhu : rekamMedis.daily_records[0]?.sessions[0]?.tanda_vital?.suhu,
        }

        resume.dataValues.pemeriksaan_fisik = {
            dada : rekamMedis.summary.ket_dada,
            perut : rekamMedis.summary.ket_perut,
            ekstremitas : rekamMedis.summary.ket_ekstremitas,
            kepala : rekamMedis.summary.ket_kepala,
            anus : rekamMedis.summary.ket_anus,
            abdomen : rekamMedis.summary.ket_abdomen,
            leher : rekamMedis.summary.ket_leher,
            mata : rekamMedis.summary.ket_mata,
            mulut : rekamMedis.summary.ket_mulut,
            hidung : rekamMedis.summary.ket_hidung,
            telinga : rekamMedis.summary.ket_telinga,
            paru : rekamMedis.summary.ket_paru,
            jantung : rekamMedis.summary.ket_jantung,
            urogenital : rekamMedis.summary.ket_urogenital,
            tenggorokan : rekamMedis.summary.ket_tenggorokan,
            muskuloskeletal : rekamMedis.summary.ket_muskuloskeletal,
        }

        resume.dataValues.anamnesis = rekamMedis.summary.keluhan_utama

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