import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import connectDatabase from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";


const app = express();
dotenv.config({path: "./config/config.env"});

app.use(cors({
    origin: [process.env.DASHBOARD_URL],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
})
);

connectDatabase();

app.use(errorMiddleware);

export default app;