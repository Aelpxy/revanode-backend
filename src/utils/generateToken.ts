import jwt from "jsonwebtoken";

export const generateToken = (apiKey: string) => {
  // @ts-ignore
  return jwt.sign({ apiKey }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });
};
