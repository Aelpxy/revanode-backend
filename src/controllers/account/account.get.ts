import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

interface UserRequest extends Request {
  user: {
    apiKey: string;
  };
}

export const accountInformation = async (req: UserRequest, res: Response) => {
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
        apiKey: req.user.apiKey,
      },
    });

    res.status(200).send({
      message: "SUCCESS",
      payload: {
        id: user?.id,
        username: user?.username,
        email: user?.email,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
};
