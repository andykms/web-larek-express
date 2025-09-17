import User from './user.model';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NotFoundError } from '../errors/not-found-error';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { ms } from '../utils/ms';
import { BadRequestError } from '../errors/bad-request-error';
import { Error as MongooseError } from 'mongoose';
import { ConflictError } from '../errors/conflict-error';
import { InternalServerError } from '../errors/server-error';
import bcrypt from 'bcrypt';

dotenv.config({ path: './.env' });

const accessTokenSecret = process.env.AUTH_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.AUTH_REFRESH_TOKEN_SECRET;
const accessTokenExpiry = process.env.AUTH_ACCESS_TOKEN_EXPIRY;
const refreshTokenExpiry = process.env.AUTH_REFRESH_TOKEN_EXPIRY;

if (accessTokenSecret === undefined || refreshTokenSecret === undefined) {
    throw new Error('не найдены секретные подписи для jwt');
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
        const user = await User.findUserByCredentials(email, password);
        const accessToken = jwt.sign({ _id: user._id }, accessTokenSecret, {
            expiresIn: ms(accessTokenExpiry || '10m') / 1000,
        });
        const refreshToken = jwt.sign({ _id: user._id }, refreshTokenSecret, {
            expiresIn: ms(refreshTokenExpiry || '7d') / 1000,
        });
        const id = user._id;
        await User.findByIdAndUpdate(id, { $push: { tokens: { token: refreshToken } } }).select(
            '+tokens',
        );
        res.cookie('refreshToken', refreshToken, {
            sameSite: 'lax',
            secure: false,
            httpOnly: true,
            maxAge: 0,
        });
        const userData = user.toObject();
        res.send({
            user: {
                name: userData.name,
                email: userData.email,
            },
            success: true,
            accessToken,
        });
    } catch (error) {
        if (error === 401) {
            next(new UnauthorizedError('неверный логин или пароль'));
            return;
        }
        next(new InternalServerError());
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies || !req.cookies.accessToken) {
        return next(new BadRequestError('токен не найден'));
    }
    try {
        const userId = jwt.verify(req.cookies.accessToken, refreshTokenSecret);
        if (!userId) {
            return next(new BadRequestError('токен не действительный'));
        }
        const user = await User.findByIdAndUpdate(userId, { $set: { tokens: [] } });
        if (!user) {
            return next(new NotFoundError('пользователь не найден'));
        }
        res.clearCookie('refreshToken');
        res.cookie('refreshToken', '', {
            sameSite: 'lax',
            secure: false,
            httpOnly: true,
            maxAge: 0,
        });
        return res.send({ status: 'success' });
    } catch {
        next(new InternalServerError());
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies || !req.cookies?.refreshToken) {
        return next(new BadRequestError());
    }
    const { refreshToken } = req.cookies;
    try {
        const decodedId = await jwt.verify(refreshToken, refreshTokenSecret);
        if (!decodedId) {
            next(new UnauthorizedError());
            return;
        }
        const user = await User.findById(decodedId);
        if (!user) {
            next(new NotFoundError('пользователь не найден'));
            return;
        }
        if (!user.tokens.some((tokenObj) => tokenObj.token === refreshToken)) {
            next(new UnauthorizedError());
            return;
        }
        const accessToken = jwt.sign({ _id: decodedId }, accessTokenSecret, {
            expiresIn: ms(accessTokenExpiry || '10m') / 1000,
        });
        return res.send({
            user: {
                name: user.name,
                email: user.email,
            },
            accessToken,
            success: true,
        });
    } catch (err) {
        next(new UnauthorizedError());
    }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const accessToken = jwt.sign({ _id: user._id }, accessTokenSecret, {
            expiresIn: ms(accessTokenExpiry || '10m') / 1000,
        });
        const refreshToken = jwt.sign({ _id: user._id }, refreshTokenSecret, {
            expiresIn: ms(refreshTokenExpiry || '7d') / 1000,
        });
        await User.findByIdAndUpdate(user.id, { $push: { tokens: refreshToken } });

        res.cookie('refreshToken', refreshToken, {
            sameSite: 'lax',
            secure: false,
            httpOnly: true,
            maxAge: ms(refreshTokenExpiry || '7d'),
            path: '/',
        });
        return res.send({
            user: {
                name: user.name,
                email: user.email,
            },
            success: true,
            accessToken,
        });
    } catch (error) {
        console.error(error);
        if (error instanceof MongooseError.ValidationError) {
            return next(new BadRequestError());
        }
        if (error instanceof Error && error.message.includes('E11000')) {
            return next(new ConflictError());
        }
        return next(new InternalServerError());
    }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user;
    if (!userId) {
        next(new UnauthorizedError());
        return;
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            next(new NotFoundError());
            return;
        }
        res.send({
            user: {
                name: user.name,
                email: user.email,
            },
            success: true,
        });
    } catch {
        next(new InternalServerError());
    }
};
