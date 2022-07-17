import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateToken } from "../../utils/generateToken";

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
    });
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
};
