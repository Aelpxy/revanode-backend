import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const db = new PrismaClient();

interface UserRequest extends Request {
  user: {
    apiKey: string;
  };
}

export const accountUpdate = async (req: UserRequest, res: Response) => {
  try {
    if (req.method != "PUT") {
      res.status(405).send({
        message: "METHOD_NOT_ALLOWED",
        payload: null,
      });

      return;
    }

    const token = req.user.apiKey;

    if (req.body.password) {
      const updatedUser = await db.user.update({
        where: {
          apiKey: token || undefined,
        },
        data: {
          username: req.body.username || undefined,
          email: req.body.email || undefined,
          password: await bcrypt.hash(req.body.password, 15),
        },
      });

      res.status(200).send({
        message: "SUCCESS",
        payload: updatedUser,
      });
      return;
    }

    if (!req.body.password) {
      const findUser = await db.user.findUnique({
        where: {
          apiKey: token,
        },
      });

      const updatedUser = await db.user.update({
        where: {
          apiKey: token || undefined,
        },
        data: {
          username: req.body.username || undefined,
          email: req.body.email || undefined,
          password: findUser?.password,
        },
      });
      res.status(200).send({
        message: "SUCCESS",
        payload: updatedUser,
      });

      return;
    }
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
};
