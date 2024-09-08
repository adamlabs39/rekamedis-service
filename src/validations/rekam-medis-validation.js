import {
    alasanRequired, chatTypeRequired,
    idRequired,
    keyRequired, messageRequired, nameRequired,
    rekamMedisUuidRequired, required,
    sessionIdRequired, userUuidRequired
} from "./message-validation-error.js";
import { z } from "zod";
export default class RekamMedisValidation {
    static GET = z.object({
      rekam_medis_uuid: z.string().min(1, rekamMedisUuidRequired),
    });

    static CREATENEW = z.object({
        faskes_uuid: z.string().min(1, required),
        no_rm: z.string().min(1, required),
        no_reg: z.string().min(1, required),
        date: z.string().min(1, required),
    })

    static ADDSESSION = z.object({
        rekam_medis_uuid: z.string().min(1, rekamMedisUuidRequired),
        date_order: z.number().int(),
    })

    static DELETESESSION = z.object({
        session_uuid: z.string().min(1, idRequired),
        alasan : z.string().min(1, alasanRequired)
    })

    static ADDRECORD = z.object({
        rekam_medis_uuid: z.string().min(1, idRequired),
        date : z.string().min(1, required),
    })

    static INSERTASSESSMENT = z.object({
        session_uuid : z.string().min(1, sessionIdRequired),
        key : z.string().min(1, keyRequired),
        rekam_medis_uuid : z.string().min(1, rekamMedisUuidRequired),
        is_latest : z.boolean(),
    })

    static INSERTCHAT = z.object(
        {
            session_uuid : z.string().min(1, sessionIdRequired),
            message : z.string().min(1, messageRequired),
            name : z.string().min(1, nameRequired),
            user_uuid : z.string().min(1, userUuidRequired),
        }
    )

    static UPDATECHAT = z.object({
        chat_uuid : z.string().min(1, sessionIdRequired),
        message : z.string().min(1, messageRequired),
        }
    )

    static GETHISTORY =  z.object({
            faskes_uuid : z.string().min(1, required),
            no_rm : z.string().min(1, required),
        }
    )

    static INSERT_TINDAKAN = z.object({
        session_uuid : z.string().min(1, sessionIdRequired),
    })
}