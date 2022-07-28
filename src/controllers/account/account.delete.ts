import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const accountDelete = async (req: Request, res: Response) => {
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

    if (!user) {
      res.status(404).send({
        message: "NOT_FOUND",
        payload: null,
      });
    }

    await db.user.delete({
      where: {
        apiKey: user?.apiKey,
      },
      include: {
        servers: true,
      }
    });

    res.status(200).send({
      message: "SUCCESS",
      payload: "Account Deleted",
    });
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
};
