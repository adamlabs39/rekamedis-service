import {
    alasanRequired,
    idRequired,
    keyRequired,
    rekamMedisUuidRequired,
    sessionIdRequired
} from "./message-validation-error.js";
import { z } from "zod";
export default class RekamMedisValidation {
    static GET = z.object({
      rekam_medis_uuid: z.string().min(1, rekamMedisUuidRequired),
    });

    static ADDSESSION = z.object({
        rekam_medis_uuid: z.string().min(1, rekamMedisUuidRequired),
        date_order: z.number().int(),
        sesi: z.number().int(),
    })

    static DELETESESSION = z.object({
        id: z.string().min(1, idRequired),
        alasan : z.string().min(1, alasanRequired)
    })

    static ADDRECORD = z.object({
        id: z.string().min(1, idRequired)
    })

    static INSERTASSESSMENT = z.object({
        session_id : z.string().min(1, sessionIdRequired),
        key : z.string().min(1, keyRequired)
    })
}