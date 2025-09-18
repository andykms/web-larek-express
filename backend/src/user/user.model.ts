import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UnauthorizedError from '../errors/unauthorized-error';

interface IToken {
  token: string;
}

interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: IToken[];
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string,
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
}

const tokenSchema = new mongoose.Schema<IToken>({
  token: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Ё-мое',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    select: false,
  },
  tokens: [tokenSchema],
});

userSchema.static(
  'findUserByCredentials',
  async function findUserByCredentials(email: string, password: string) {
    try {
      const user = await this.findOne({ email }).select('+password');
      if (!user) {
        return Promise.reject(new UnauthorizedError('неверный логин или пароль'));
      }
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        return Promise.reject(new UnauthorizedError('неверный логин или пароль'));
      }
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(new UnauthorizedError('неверный логин или пароль'));
    }
  },
);

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
