import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// user defined
import { User } from "../models/user.model";
import auth from "../middleware/auth.middleware";

dotenv.config();

const authRoutes = () => {
  const router = Router();

  router.get("/", auth, async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.body.user.id).select("-password");
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

  router.post(
    "/login",
    check("email", "please include a valid email").isEmail(),
    check("password", "password is required").exists(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      try {
        let user = await User.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid Credentials" }] });
        }

        console.log(user.id);

        const payload = {
          user: {
            id: user.id,
          },
        };
        const jwt_secret = process.env.JWT_PRIVATE_KEY || '1234567890';
        jwt.sign(
          payload,
          jwt_secret,
          { expiresIn: "5 days" },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
      }
    }
  );

  router.post(
    "/register",
    check("email", "please include a valid email").isEmail(),
    check("password", "password is required").exists(),
    check("name", "username is required").exists(),
    check("mobile", "mobile is required").exists(),

    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      try {
        let user = await User.findOne({ email });

        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "User already exists" }] });
        }

        const newUser = {
          ...req.body,
        };

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        const result = await User.create({
          name: newUser.name,
          email: newUser.email,
          mobile: newUser.mobile,
          password: hashPassword,
        });

        if (!result) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid parameter" }] });
        }

        user = await User.findOne({ email: newUser.email });

        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid User" }] });
        }

        const payload = {
          user: {
            id: user.id,
          },
        };

        const jwt_secret = process.env.JWT_PRIVATE_KEY || '1234567890';
        jwt.sign(
          payload,
          jwt_secret,
          { expiresIn: "5 days" },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );

      } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
      }
    }
  );

  return router;
};

export default authRoutes;
