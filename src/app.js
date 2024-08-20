import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";
import errorMiddleware from "./middlewares/error-middleware.js";
import authorizationMiddleware from "./middlewares/authorization-middleware.js";
import mongooseInstance from "./configurations/mongoose-instance.js";
import RekamMedisModel from "./models/mongos/rekam-medis-model.js";
import SessionModel from "./models/mongos/session-model.js";
import RekamMedisController from "./controllers/rekam-medis-controller.js";

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

    // const session2 = new SessionModel({order: 1});
    // const session3 = new SessionModel({order: 2});
    //
    // await session2.save();
    // await session3.save();
    //
    //
    // const rekamMedis = new RekamMedisModel({
    //     daily_records: [{
    //         sessions: [session2._id, session3._id],
    //     }],
    //     faskes_uuid: "akdmadkmqdqplqp",
    // });
    //
    // await rekamMedis.save();
    // let rekamMedis1 = await RekamMedisModel.findOne({ _id: "66c405403d0bd31989ff677b" });
    // const order = rekamMedis1.daily_records[0].sessions.length + 1;
    //
    // const session1 = new SessionModel({order: order});
    // await session1.save();
    // rekamMedis1.daily_records[0].sessions.push(session1._id);
    // await rekamMedis1.save();


    // const rekamMedis3 = await RekamMedisModel.findOne({ _id: "66c405403d0bd31989ff677b" }).populate({
    //     path : "daily_records.sessions",
    //     match : { order : 1}
    // }).exec();
    //
    // console.log(rekamMedis3.daily_records[0]);




    console.log(`Server running on http://${APPLICATION_HOST}:${APPLICATION_PORT}`);
});