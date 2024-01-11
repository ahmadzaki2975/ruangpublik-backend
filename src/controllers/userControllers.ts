import { Request, Response } from "express";
import User from "../models/user";
import { MongooseError } from "mongoose";

interface CreateUserInput {
  username: string;
  password: string;
  email: string;
  role?: string;
  salt: string;
}

const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email, role, salt } = req.body as CreateUserInput;
    const user = await User.create({
      username,
      password,
      email,
      role: role ?? "user",
      salt
    });
    user.save().then(() => {
      res.status(201).json();
    });
    return res.status(201).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } 
    if (error instanceof MongooseError) {
      return res.status(400).json({ error: error.message });
    }
    else {
      console.log(error);
      return res.status(500).json({ error: "An unknown error occured" });
    }
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (user) {
      return res.status(200).json({ message: "User deleted" });
    }
    throw new Error("User not found");
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

export { createUser, deleteUser, getAllUsers };
