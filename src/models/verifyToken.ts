import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || (req.headers.Authorization as string);
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
    const decodedToken = decoded as JwtPayload;
    if (err) return res.sendStatus(403);
    req.body.email = decodedToken?.email;
    req.body.id = decodedToken?.id;
    req.body.role = decodedToken?.role;
    next();
  });
};

export { verifyToken };
