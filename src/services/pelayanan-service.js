import ZodValidator from "../validations/zod-validator.js";
import PelayananValidation from "../validations/pelayanan-validation.js";
import PelayananRepository from "../repositories/pelayanan-repository.js";
import InternalServerException from "../errors/internal-server-exception.js";
import Utils from "../helpers/utils.js";
import RekamMedisRepository from "../repositories/rekam-medis-repository.js";
import {uuidv7} from "uuidv7";
import BadRequestException from "../errors/bad-request-exception.js";
import NotfoundException from "../errors/notfound-exception.js";

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
        let diagnosiss = [];

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

        rekamMedis.daily_records.forEach((daily_record) => {
            const sessions = daily_record.sessions ?? [];
            sessions.forEach((session) => {
                const diagnosis_dokter = session.diagnosis_dokter ?? [];

                if (diagnosis_dokter?.length !== 0) {
                    diagnosis_dokter.forEach((diagnosis_item) => {
                        diagnosiss.push(diagnosis_item);
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

        resume.dataValues.diagnosa_dokter = diagnosiss;

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
        ZodValidator.validate(PelayananValidation.DISCHARGE, request);

        // TODO : ADD TRANSACTION FOR THIS TRANSACTION
        await this.insertHistoryTindakan(request);

        const affectedRow = await PelayananRepository.dichargeService(request.pelayanan , Utils.snakeToCamelObject(request));
        if (affectedRow[0] === 0) {
            throw new InternalServerException("Pelayanan tidak berhasil di discharge");
        }

        return {message: `berhasil discharge resume medis`}

    }

    static async insertHistoryTindakan(request) {
        let historyTindakan = [];
        let petugasTindakan = [];
        ZodValidator.validate(PelayananValidation.INSERT_HISTORY_TINDAKAN, request);
        const rekamMedis = await RekamMedisRepository.getResumeNeed({rekam_medis_uuid: request.rekam_medis_uuid})

        if (rekamMedis !== null) {
            rekamMedis.daily_records.forEach((daily_record) => {
                const sessions = daily_record.sessions ?? [];
                sessions.forEach((session) => {
                    const pemeriksaan_tindakan = session.pemeriksaan_tindakan ?? [];

                    if (pemeriksaan_tindakan?.length !== 0) {
                        pemeriksaan_tindakan.forEach((tindakan_item) => {
                            const tindakan_uuid = uuidv7();
                            const tindakan = {
                                faskesUuid: request.faskes_uuid,
                                uuid: tindakan_uuid,
                                tarif_uuid: tindakan_item.tarif_uuid,
                                nama_tindakan: tindakan_item.tarif_uuid,
                                harga_tindakan: tindakan_item.harga_tindakan,
                                qty_tindakan: tindakan_item.qty_tindakan,
                                lokasi_uuid: request.lokasi_uuid,
                                pelayanan: request.pelayanan,
                            }
                            historyTindakan.push(tindakan);

                            tindakan_item.petugas.forEach((petugas_item) => {
                                const petugas = {
                                    faskesUuid: request.faskes_uuid,
                                    historyTindakanUuid: tindakan_uuid,
                                    practitionerUuid: petugas_item.practitioner_uuid,
                                }

                                petugasTindakan.push(petugas)
                            })
                        })
                    }
                })
            })
        } else {
            throw new BadRequestException("Rekam medis tidak ditemukan");
        }
        await PelayananRepository.insertHistory(historyTindakan, petugasTindakan);
    }

    static async createRiFromSrpi(request) {
        ZodValidator.validate(PelayananValidation.CREATE_RAWAT_INAP, request);
        const layanan = await PelayananRepository.getPelayanan(request.admission_type, request.rekam_medis_uuid);
        if (layanan == null) {
            throw new NotfoundException("Pelayanan tidak ditemukan");
        }

        const noPelayanan = await Utils.generateNoPelayanan("RI", layanan.dataValues.faskesUuid);

        const data = {
            noReg : layanan.dataValues.noReg,
            patientUuid : layanan.dataValues.patientUuid,
            name : layanan.dataValues.name,
            noRm : layanan.dataValues.noRm,
            birthDetailUuid : layanan.dataValues.birthDetailUuid,
            gender: layanan.dataValues.gender,
            practitionerUuid : request.practitioner_uuid,
            statusRi : 1,
            encounter : "RI",
            faskesUuid : layanan.dataValues.faskesUuid,
            paymentMethod : layanan.dataValues.paymentMethod,
            noPelayanan : noPelayanan,
            no_spri : request.nomor_surat
        };
        return await PelayananRepository.createRawatInap(data);
    }
}