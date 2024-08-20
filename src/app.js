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

    console.log(`Server running on http://${APPLICATION_HOST}:${APPLICATION_PORT}`);
});