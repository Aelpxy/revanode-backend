import express, { Express, Response, Request } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import router from "./routes/router";

const app: Express = express();
dotenv.config();

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
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