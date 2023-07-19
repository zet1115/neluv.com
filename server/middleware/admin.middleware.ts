import { Request, Response, NextFunction } from "express";

const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.user.role !== "admin")
    return res.status(403).send("you are not an admin");
  next();
};
