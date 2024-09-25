import {z} from "zod";
import {required} from "./message-validation-error.js";

export default class PelayananValidation {
    static UPDATEDIRUJUK = z.object({
        is_internal : z.boolean(),
        rujuk_internal : z.string(),
        rujuk_eksternal : z.string(),
        instruksi_tindak_lanjut : z.string().min(1, required),
        tujuan_rujuk : z.string().min(1, required),
        tujuan_rujuk_lainnya : z.string().min(1, required),
        transport_rujuk : z.string(),
        transport_rujuk_lainnya : z.string(),
        instruksi_no_darurat : z.string(),
    });

    static BEFOREUPDATE = z.object({
        rekam_medis_uuid: z.string().min(1, required),
        status_pulang : z.string().min(1, required),
        pelayanan : z.string().min(1, required),
        edukasi : z.string().min(1, required),
        edukasi_text : z.string().min(1, required),
        kondisi_pasien_pulang : z.string().min(1, required),
        discharge_date : z.number(),
        faskes_uuid : z.string().min(1, required),
    });

    static UPDATELAINNYA = z.object({
        status_pulang_keterangan : z.string().min(1, required),
    })

    static GET = z.object({
        rekam_medis_uuid: z.string().min(1, required),
        pelayanan : z.string().min(1, required),
        faskes_uuid : z.string().min(1, required),
    })

    static DISCHARGE = z.object({
        rekam_medis_uuid: z.string().min(1, required),
        pelayanan : z.string().min(1, required),
        faskes_uuid : z.string().min(1, required),
    })

    static CREATE_RAWAT_INAP = z.object({
        practitioner_uuid: z.string().min(1, required),
    })
}