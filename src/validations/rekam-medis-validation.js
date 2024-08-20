import {rekamMedisUuidRequired} from "./message-validation-error.js";
import { z } from "zod";
export default class RekamMedisValidation {
    static GET = z.object({
      rekam_medis_id: z.string().min(1, rekamMedisUuidRequired),
    })
}