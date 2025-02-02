import cors from "cors";
import express from "express";
import "express-async-errors";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import recommendationRouter from "./routers/recommendationRouter.js";
import testRouter from "./routers/e2eTestsRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/recommendations", recommendationRouter);
process.env.NODE_ENV === 'test' && app.use("/e2e", testRouter)
app.use(errorHandlerMiddleware);

export default app;
