import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const accountInformation = async (req: Request, res: Response) => {
  try {
    const user = await db.user.findUnique({
      where: {
        // @ts-ignore
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
