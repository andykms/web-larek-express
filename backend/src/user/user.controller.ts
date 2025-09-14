import User from "./user.model";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { scryptSync } from "crypto";

interface User {
  email: string;
  password: string;
}

dotenv.config({ path: './.env' });

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

if(accessTokenSecret === undefined || refreshTokenSecret === undefined) {
  throw new Error("Access token or refresh token secret is not defined");
}

export const login = async (req: Request, res: Response) => {
  const {email, password} = req.body;

  return User.find(email, password)
    .then(user => {
      const token = jwt

      return res.json({user});
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({message: "Internal server error"});
    });
}