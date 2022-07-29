import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
    }

    const server = await db.server.create({
      data: {
        name: req.body.name,
        panelId: req.body.paneId,
        amount: req.body.amount,
        region: req.body.region,
        paymentId: req.body.paymentId,
        active: false,
        userId: Number(user?.id),
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
};
