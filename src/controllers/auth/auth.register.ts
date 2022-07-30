import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateToken } from "../../utils/generateToken";
import Stripe from "stripe";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const db = new PrismaClient();

export const authRegister = async (req: Request, res: Response) => {
  try {
    if (req.method != "POST") {
      res.status(405).send({
        message: "METHOD_NOT_ALLOWED",
        payload: null,
      });

      return;
    }

    if (!req.body.email && !req.body.password && !req.body.username) {
      res.status(500).send({
        message: "BAD_REQUEST",
        payload: null,
      });

      return;
    }

    if (req.body.password.length < 8) {
      res.status(500).send({
        message: "BAD_REQUEST",
        payload: null,
      });

      return;
    }

    const doesEmailExist = await db.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (doesEmailExist) {
      res.status(409).send({
        message: "RESOURCE_CONFLICT",
        payload: null,
      });

      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 15);

    const User = await db.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword.toString(),
        apiKey: crypto.randomBytes(16).toString("hex"),
        stripeId: "null",
      },
    });

    const stripeCustomerPortal = await stripe.customers.create({
      name: User.username,
      email: User.email,
      metadata: {
        customer_internal_id: User.id,
        customer_apiKey: User.apiKey,
      },
    });

    await db.user.update({
      where: {
        id: User.id,
      },
      data: {
        stripeId: stripeCustomerPortal.id,
      },
    });

    res.status(201).send({
      message: "CREATED",
      payload: {
        id: User.id,
        name: User.username,
        email: User.email,
        auth_token: generateToken(User.apiKey),
      },
      stripeInfo: stripeCustomerPortal,
    });
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
};
