import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const db = new PrismaClient();

export const customerPortal = async (req: Request, res: Response) => {
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

    const customerPortalSession = await stripe.billingPortal.sessions.create({
      // @ts-ignore
      customer: user?.stripeId,
    });

    res.status(200).send({
      message: "SUCCESS",
      payload: {
        url: customerPortalSession.url,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: error,
    });
  }
};
