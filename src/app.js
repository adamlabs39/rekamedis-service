import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import errorMiddleware from "./middlewares/error-middleware.js";
import authorizationMiddleware from "./middlewares/authorization-middleware.js";
import mongooseInstance from "./configurations/mongoose-instance.js";
import MODELMERGE from "./models/postgreses/model-synchronize.js";
import sequelizeInstance from "./configurations/sequelize-instance.js";
import RawatJalanModel from "./models/postgreses/rawat-jalan-model.js";
import RawatInapModel from "./models/postgreses/rawat-inap-model.js";
import InstalasiGawatDaruratModel from "./models/postgreses/instalasi-gawat-darurat-model.js";
import {dbSeeder} from "./seeders/db-seeder.js";

const APPLICATION_PORT = process.env.APPLICATION_PORT;
const APPLICATION_HOST = process.env.APPLICATION_HOST;

const app = express();
app.use(cors({
    origin: '*',
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'User-Agent', 'Content-Length', 'Authorization'],
    methods: ['GET', 'POST', 'HEAD', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authorizationMiddleware)
app.use(routes);
app.use(errorMiddleware);

app.listen(APPLICATION_PORT, APPLICATION_HOST, async () => {
    await mongooseInstance();

    try {
        for (const model of MODELMERGE) {
            await model.sync({ alter: false, force: true });
        }

        await dbSeeder();
    } catch (error) {
        console.error("Failed to synchronize the database:", error);
    }


    await sequelizeInstance.transaction(async (tr) => {
        await RawatJalanModel.findOrCreate({
            transaction: tr,
            where: {
                no_reg: "1234abcd"
            },
            defaults : {
                noReg : "1234abcd",
                patientUuid : "1234aabb",
                name : "joko",
                noRm : "1234a",
                birthDetailUuid : "aaaaa",
                gender : "lakik",
                practitionerUuid : "0191a18a-22e4-79f7-9da5-a10a6e1a60f9",
                statusRj : 5,
                lokasiUuid : "0191a18a-22e4-773b-8229-a023f420d0bb",
                faskesUuid : "9d403ufjh43ufh3uf8430ihf",
                rekamMedisUuid : "66d81d6845871723afbfe42d",
                noPelayanan : "pelayanan1"
            },

        })
         await RawatInapModel.findOrCreate({
            transaction: tr,
            where: {
                no_reg: "1234abcd"
            },
            defaults : {
                noReg : "1234abcd",
                patientUuid : "1234aabb",
                name : "joko",
                noRm : "1234a",
                birthDetailUuid : "aaaaa",
                gender : "lakik",
                practitionerUuid : "0191a18a-22e4-79f7-9da5-a10a6e1a60f9",
                statusRi : 4,
                encounter : "RI",
                faskesUuid : "9d403ufjh43ufh3uf8430ihf",
                paymentMethod : 0,
                monitoringRoomUuid : "qowkqokdqolp",
                lokasiUuid : "adlkepqldo",
                rekamMedisUuid : "66d81d6845871723afbfe42d",
                noPelayanan : "pelayanan1"
            },
        })
        await InstalasiGawatDaruratModel.findOrCreate({
            transaction: tr,
            where: {
                no_reg: "1234abcd"
            },
            defaults : {
                noReg : "1234abcd",
                patientUuid : "1234aabb",
                name : "joko",
                noRm : "1234a",
                birthDetailUuid : "aaaaa",
                gender : "lakik",
                practitionerUuid : "0191a18a-22e4-79f7-9da5-a10a6e1a60f9",
                statusIgd : 2,
                faskesUuid : "9d403ufjh43ufh3uf8430ihf",
                paymentMethod : 0,
                maternity : false,
                newborn : false,
                multipleBirth : false,
                withoutIdentity : false,
                rekamMedisUuid : "66d81d6845871723afbfe42d",
                noPelayanan : "pelayanan1"
            },
        })
    });

    console.log(`Server running on http://${APPLICATION_HOST}:${APPLICATION_PORT}`);
});