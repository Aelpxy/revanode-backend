import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const db = new PrismaClient();

export const accountUpdate = async (req: Request, res: Response) => {
  try {
    if (req.method != "PUT") {
      res.status(405).send({
        message: "METHOD_NOT_ALLOWED",
        payload: null,
      });

      return;
    }

    // @ts-ignore
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
        payload: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
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
        payload: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
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
