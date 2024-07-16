import express from "express";
import userRouter from "./routers/user"
import workerRouter from "./routers/worker"
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors())

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use("/v1/user", userRouter);
app.use("/v1/worker", workerRouter);

app.listen(4000);