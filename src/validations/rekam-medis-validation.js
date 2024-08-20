import {rekamMedisUuidRequired} from "./message-validation-error.js";
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
}