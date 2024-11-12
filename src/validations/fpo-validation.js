import {
    required
} from "./message-validation-error.js";
import { z } from "zod";

export default class FpoValidation {
    static GET = z.object({
        date : z.string().min(1, required),
        prescription_item_uuid : z.string().min(1, required),
    });
}