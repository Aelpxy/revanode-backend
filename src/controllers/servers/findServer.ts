import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const db = new PrismaClient();

export const findServerbyId = async (req: Request, res: Response) => {
  try {
    if (req.method != "GET") {
      res.status(405).send({
        message: "METHOD_NOT_ALLOWED",
        payload: null,
      });

      return;
    }

    const user = await db.user.findUnique({
      where: {
        // @ts-ignore
        apiKey: req.user.apiKey,
      },
    });

    if (!user) {
      res.status(404).send({
        message: "NOT_FOUND",
        payload: null,
      });

      return;
    }

    const server = await db.server.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!server) {
      res.status(404).send({
        message: "NOT_FOUND",
        payload: null,
      });

      return;
    }

    if (server?.userId != user?.id) {
      res.status(403).send({
        message: "FORBIDDEN",
        payload: null,
      });

      return;
    }

    const payment = await stripe.checkout.sessions.retrieve(server.paymentId);

    res.status(200).send({
      message: "SUCCESS",
      payload: {
        server: server,
        payment: {
          id: payment.id,
          amount: payment.amount_total,
          type: payment.mode,
          status: payment.payment_status,
        },
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
};
