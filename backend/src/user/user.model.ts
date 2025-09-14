import mongoose from 'mongoose';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { NotFoundError } from '../errors/not-found-error';
import { BadRequestError } from '../errors/bad-request-error';
import { InternalServerError } from '../errors/server-error';

export const userValidation = Joi.object({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

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
    tokens: [
        {
            type: String,
        },
    ],
});

userSchema.static(
    'findUserByCredentials',
    async function findUserByCredentials(email: string, password: string) {
        try {
            const user = await this.findOne({ email });
            if (!user) {
                return Promise.reject(new NotFoundError());
            }
            const matched = await bcrypt.compare(password, user.password);
            if (!matched) {
                return Promise.reject(new BadRequestError('неправильный логин или пароль'));
            }
            return Promise.resolve(user);
        } catch {
            return Promise.reject(new InternalServerError('ошибка авторизации'));
        }
    },
);

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
