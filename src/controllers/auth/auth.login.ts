import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken";
import Stripe from "stripe";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const db = new PrismaClient();

export const authLogin = async (req: Request, res: Response) => {
  try {
    if (req.method != "POST") {
      res.status(405).send({
        message: "METHOD_NOT_ALLOWED",
        payload: null,
      });

      return;
    }
    if (!req.body.email && !req.body.password) {
      res.status(500).send({
        message: "BAD_REQUEST",
        payload: null,
      });

      return;
    }
    const user = await db.user.findFirst({
      where: {
        email: req.body.email.toString(),
      },
    });

    if (!user) {
      res.status(404).send({
        message: "NOT_FOUND",
        payload: null,
      });

      return;
    }

    const validpassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!validpassword) {
      res.status(401).send({
        message: "INVALID_PASSWORD",
        payload: null,
      });

      return;
    }
    res.status(200).send({
      message: "SUCCESS",
      payload: {
        auth_token: generateToken(user.apiKey),
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
};
