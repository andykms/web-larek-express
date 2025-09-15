import mongoose from 'mongoose';
import Joi from 'joi';
import bcrypt from 'bcrypt';

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
                return Promise.reject(404);
            }
            const matched = await bcrypt.compare(password, user.password);
            if (!matched) {
                return Promise.reject(401);
            }
            return Promise.resolve(user);
        } catch (error) {
            return Promise.reject(error);
        }
    },
);

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
