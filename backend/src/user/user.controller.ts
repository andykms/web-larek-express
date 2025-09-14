import User from './user.model';
import { NextFunction, Request, Response } from 'express';
import jwt, { SignCallback } from 'jsonwebtoken';
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

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
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

        await User.findByIdAndUpdate(id, { $push: { tokens: refreshToken } });

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
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = jwt.verify(req.cookies.refreshToken, refreshTokenSecret);
        if (!userId) {
            next(new UnauthorizedError());
            return;
        }
        await User.findByIdAndUpdate(userId, { $set: { tokens: [] } });
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
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        next(new UnauthorizedError());
        return;
    }
    try {
        const decodedId = await jwt.verify(refreshToken, refreshTokenSecret);
        const accessToken = jwt.sign({ _id: decodedId }, accessTokenSecret, {
            expiresIn: ms(accessTokenExpiry || '10m') / 1000,
        });
        const user = await User.findById(decodedId);
        if (!user) {
            next(new NotFoundError('пользователь не найден'));
            return;
        }
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
        const user = await User.create({ name, email, hashedPassword });
        const accessToken = jwt.sign({ _id: user._id }, accessTokenSecret, {
            expiresIn: ms(accessTokenExpiry || '10m') / 1000,
        });
        const refreshToken = jwt.sign({ _id: user._id }, refreshTokenSecret, {
            expiresIn: ms(refreshTokenExpiry || '7d') / 1000,
        });
        await user.updateOne({ $push: { tokens: refreshToken } });

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
        if (error instanceof MongooseError.ValidationError) {
            return next(new BadRequestError());
        }
        if (error instanceof Error && error.message.includes('E11000')) {
            return next(new ConflictError());
        }
        return next(new InternalServerError());
    }
};

export const getCurrentUser = async (
    req: Request & { userId: string },
    res: Response,
    next: NextFunction,
) => {
    const userId = req.userId;
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
