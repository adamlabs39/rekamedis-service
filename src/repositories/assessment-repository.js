import SessionModel from "../models/mongos/session-model.js";
import CatatanPerawatModel from "../models/mongos/catatan-perawat-model.js";
import InstruksiMedisModel from "../models/mongos/instruksi-medis-model.js";

export default class AssessmentRepository {
    static async insert(sessionId, data, key) {
        return await SessionModel.findOneAndUpdate({_id: sessionId}, {
            [key]: data
        }, {new: true}).exec();
    }

    static async insertCatatanPerawat(sessionId, data) {
        const catatanPerawat = new CatatanPerawatModel(data);
        await catatanPerawat.save();

        return await SessionModel.findOneAndUpdate({_id: sessionId}, {
            $push :  {
                "catatan_perawat" : catatanPerawat
            }
        }, {new: true}).exec();
    }

    static async insertInstruksiMedis(sessionId, data) {
        const instruksiMedis = new InstruksiMedisModel(data);
        await instruksiMedis.save();

        return await SessionModel.findOneAndUpdate({_id: sessionId}, {
            $push :  {
                "instruksi_medis" : instruksiMedis
            }
        }, {new: true}).exec();
    }

    static async updateCatatanPerawat(catatanPerawatId, data) {
        return await CatatanPerawatModel.findOneAndUpdate({_id: catatanPerawatId}, {
            message : data.message,
            time : data.time
        }, {new: true}).exec();
    }

    static async updateInstruksiMedis(instruksiMedisId, data) {
        return await InstruksiMedisModel.findOneAndUpdate({_id: instruksiMedisId}, {
            message : data.message,
            time : data.time
        }, {new: true}).exec();
    }
}