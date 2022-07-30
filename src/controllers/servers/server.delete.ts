import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const db = new PrismaClient();

export const deleteServer = async (req: Request, res: Response) => {
  try {
    if (req.method != "DELETE") {
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

    const server = await db.server.findUnique({
      where: {
        id: Number(req.body.id),
      },
    });

    if (server?.userId != user?.id) {
      res.status(403).send({
        message: "FORBIDDEN",
        payload: null,
      });

      return;
    }

    if (!server) {
      res.status(404).send({
        message: "NOT_FOUND",
        payload: null,
      });

      return;
    }

    await stripe.subscriptions.del(server.paymentId);

    await db.server.delete({
      where: {
        id: Number(req.body.id),
      },
    });

    res.status(200).send({
      message: "SUCCESS",
      payload: "Server Deleted",
    });
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
};
