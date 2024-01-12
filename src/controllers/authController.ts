import { Request, Response } from "express";
import User from "../models/user";
import { MongooseError } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface SignupUser {
  fullname: string;
  username: string;
  email: string;
  password: string;
  nikCode: string;
  role?: string;
}

interface LoginUser {
  email: string;
  password: string;
}

const userSignupController = async (req: Request, res: Response) => {
  try {
    const { fullname, username, email, password, nikCode, role } = req.body as SignupUser;

    const emailExist = await User.findOne({ email });
    const usernameExist = await User.findOne({ username });

    if (emailExist) {
      return res.status(400).json({ success: false, error: "Email already exist" });
    }

    if (usernameExist) {
      return res.status(400).json({ success: false, error: "Username already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      fullname,
      username,
      email,
      nik: { nikCode },
      password: hashedPassword,
      role: role ?? "user",
    };

    const newUser = await User.create(user);
    await newUser.save();
    return res.status(201).json({ success: true, message: `User with email: ${email} created!` });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    if (error instanceof MongooseError) {
      return res.status(400).json({ success: false, error: error.message });
    } else {      
      return res.status(500).json({ success: false, error: "An unknown error occured" });
    }
  }
};

const userLoginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginUser;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User is not registered" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({ success: false, error: "Email or password are incorrect" });
    }

    const expiresIn = 60 * 60 * 24;
    const accessToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn }
    );

    return res.status(200).json({
      success: true,
      message: `User with email: ${email} logged in`,
      data: { accessToken },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    if (error instanceof MongooseError) {
      return res.status(400).json({ success: false, error: error.message });
    } else {      
      return res.status(500).json({ success: false, error: "An unknown error occured" });
    }
  }
};

export { userSignupController, userLoginController };
