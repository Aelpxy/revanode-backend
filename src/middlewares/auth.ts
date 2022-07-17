import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

export const authorizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token: any;

  if (
    req.headers.authorization &&
    req.headers.authorization?.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization?.split(" ")[1];

      // @ts-ignore
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // @ts-ignore
      req.user = decode;
      next();
    } catch (error) {
      console.log(error);

      res.status(401).send({
        message: "UNAUTHORIZED",
        payload: null,
      });
    }
  }
  if (!token) {
    res.status(401).send({
      message: "NO_AUTH_TOKEN_INCLUDED",
      payload: null,
    });

    return;
  }
};
