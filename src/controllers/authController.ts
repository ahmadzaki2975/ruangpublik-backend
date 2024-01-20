import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { MongooseError } from "mongoose";

import User from "../models/user";

dotenv.config();

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

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5000/auth/google/callback"
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "online",
  scope: scopes,
  include_granted_scopes: true,
});

const googleAuthController = (req: Request, res: Response) => {
  res.redirect(authorizationUrl);
};

const googleAuthCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code as string);

  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  const { data } = await oauth2.userinfo.get();

  if (!data) {
    return res.json({
      success: false,
      message: "Failed to retrieve user information from Google's OAuth2",
    });
  }

  const user = await User.findOne({ email: data.email });

  if (!user) {
    try {
      // NOTE: Initiate user data with "-" since it is required
      const newUser = await User.create({
        fullname: "-",
        username: "-",
        email: data.email,
        password: "-",
        nik: {
          nikCode: "-",
        },
      });

      newUser.save();

      return res.redirect("http://localhost:3000/signup?success=true");
    } catch (error) {
      return res.status(500).json({ success: false, error: "An unknown error occured" });
    }
  }

  const payload = { id: user?._id, email: user?.email, role: user?.role };
  const secret = process.env.ACCESS_TOKEN_SECRET!;
  const expiresIn = 60 * 60 * 24;

  const accessToken = jwt.sign(payload, secret, { expiresIn });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 3600 * 1000,
  });

  return res.redirect("http://localhost:3000/");
};

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

    const payload = { email: user.email, id: user._id, role: user.role };
    const secret = process.env.ACCESS_TOKEN_SECRET!;
    const expiresIn = 60 * 60 * 24;

    const accessToken = jwt.sign(payload, secret, { expiresIn });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 3600 * 1000,
    });

    console.log("User logged in");
    console.log("User data: ", user);

    return res.status(200).json({
      success: true,
      // message: `User with email: ${email} logged in`,
      message: accessToken,
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

const userLogoutController = async (req: Request, res: Response) => {
  res.cookie("accessToken", "", {
    maxAge: 0,
  });
  res.sendStatus(200);
};

export {
  googleAuthCallback,
  googleAuthController,
  userLoginController,
  userLogoutController,
  userSignupController,
};
