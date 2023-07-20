import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  if (!token.startsWith('Bearer ')){
    return res.status(401).json({ msg: "Invalid token, authorization denied" });
  }
  token = token.replace('Bearer ', '');
  try {
    const jwt_secret = process.env.JWT_PRIVATE_KEY || '1234567890';
    jwt.verify(token, jwt_secret, (error: any, decoded: { user: any }) => {
      if (error) {
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        req.body.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};

export default auth;
