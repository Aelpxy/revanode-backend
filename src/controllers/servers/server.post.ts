import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

// @ts-ignore
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const db = new PrismaClient();

export const postServer = async (req: Request, res: Response) => {
  try {
    if (req.method != "POST") {
      res.status(405).send({
        message: "METHOD_NOT_ALLOWED",
        payload: null,
      });

      return;
    }

    if (
      !req.body.name &&
      !req.body.amount &&
      !req.body.region &&
      !req.body.paymentId
    ) {
      res.status(500).send({
        message: "BAD_REQUEST",
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
        payload: "User does not exist",
      });

      return;
    }

    const sub = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Number(req.body.amount),
            product_data: {
              name: req.body.name,
              description: `
              Location ${req.body.region}
              `,
            },
          },
          quantity: 1,
        },
        {price: 'price_1LR9lOI2aJzxZgFMxN7uim9O', quantity: 1},
      ],
      success_url: `https://revanode.space?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://revanode.space/cancel`,
    });

    const server = await db.server.create({
      data: {
        name: req.body.name,
        amount: req.body.amount,
        region: req.body.region,
        paymentId: sub.id,
        userId: Number(user?.id),
      },
    });

    console.log(sub);

    res.status(201).send({
      message: "SUCCESS",
      payload: sub.url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
};
