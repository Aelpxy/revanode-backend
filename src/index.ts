import express, { Express, Response, Request } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from 'express-rate-limit'
import router from "./routes/router";

const app: Express = express();
dotenv.config();

const port = process.env.PORT || 8080;

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(limiter)

app.use("/v1", router);

app.get("*", (req: Request, res: Response) => {
  try {
    res.status(404).send({
      message: "NOT_FOUND",
      payload: null,
    });
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
});

app.listen(port, () => {
  console.log(`[LOG] Listening on PORT ${port}`);
});