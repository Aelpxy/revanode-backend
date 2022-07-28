import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

interface UserRequest extends Request {
  user: {
    apiKey: string;
  };
}

export const getServer = async (req: UserRequest, res: Response) => {
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

    const server = await db.server.findMany({
      where: {
        userId: Number(user.id),
      },
    });

    if (!server) {
      res.status(404).send({
        message: "NOT_FOUND",
        payload: null,
      });

      return;
    }

    res.status(200).send({
      message: "SUCCESS",
      payload: server,
    });
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
};
