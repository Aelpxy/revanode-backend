import { Request, Response } from "express";

export const accountUpdate = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    res.status(500).send({
      message: "INTERNAL_SERVER_ERROR",
      payload: null,
    });
  }
};
