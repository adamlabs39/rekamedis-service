import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import errorMiddleware from "./middlewares/error-middleware.js";
import authorizationMiddleware from "./middlewares/authorization-middleware.js";
import mongooseInstance from "./configurations/mongoose-instance.js";
import RekamMedisModel from "./models/mongos/rekam-medis-model.js";
import DailyRecordModel from "./models/mongos/daily-record-model.js";

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

    // const alergi = {
    //     is_alergi : true
    // }
    //
    // const session = {
    //     alergi : alergi
    // }
    //
    // const dailyRecord = new DailyRecordModel({
    //     faskes_uuid : "wekrmeirkwelqwei2k310e23rk",
    //     session : [session]
    // })
    //
    // await dailyRecord.save();
    //
    // const rekamMedisNew = new RekamMedisModel({});
    // rekamMedisNew.daily_records.push(dailyRecord);
    // await rekamMedisNew.save();

    const rekamMedis = await RekamMedisModel.find();
    console.log(rekamMedis)

    console.log(`Server running on http://${APPLICATION_HOST}:${APPLICATION_PORT}`);
});