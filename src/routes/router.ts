import express from "express";
import { Response, Request } from "express";

import { authorizeUser } from "../middlewares/auth";

import { authRegister } from "../controllers/auth/auth.register";
import { authLogin } from "../controllers/auth/auth.login";

import { accountInformation } from "../controllers/account/account.get";

const router = express.Router();

router.get("/status", (req: Request, res: Response) => {
  try {
    res.status(200).send({
      message: "SUCCESS",
      payload: {
        status: "online",
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
});

// Auth Routes
router.post("/account/register", authRegister);
router.post("/account/login", authLogin);

// /account route
router.get("/account", authorizeUser, accountInformation);

export default router;
