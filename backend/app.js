import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import connectDatabase from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import adminRouter from './routes/admin.router.js';
import serviceRouter from './routes/services.router.js';
import employeeRouter from './routes/employee.router.js';
import expensesRouter from './routes/expenses.router.js';
import donationRouter from './routes/donation.router.js';
import accountRouter from './routes/account.router.js';
import salaryRouter from './routes/salary.router.js';


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

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/employee", employeeRouter);
app.use("/api/v1/expenses", expensesRouter);
app.use("/api/v1/donation", donationRouter);
app.use("/api/v1/account", accountRouter);
app.use("/api/v1/salary", salaryRouter);


connectDatabase();

app.use(errorMiddleware);

export default app;