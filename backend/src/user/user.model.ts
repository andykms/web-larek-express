import mongoose from "mongoose";
import Joi from "joi";


export const userValidation = Joi.object({
  name: Joi.string().min(2).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

interface IToken {
  token: string
}

interface IUser {
  name: string,
  email: string,
  password: string,
  tokens: IToken[]
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Ё-мое"
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  tokens: [{
    type: String
  }]
})

const User = mongoose.model("User", userSchema);

export default User;