import { Router } from 'express';
import { login, register, refresh, getCurrentUser, logout } from './user.controller';
import { auth } from '../middlewares/auth';
import { registrationValidator } from './user.validator';

const rootPath = '/auth';

const userRouter = Router();

userRouter.post(`${rootPath}/register`, registrationValidator, register);
userRouter.post(`${rootPath}/login`, login);
userRouter.get(`${rootPath}/token`, auth, refresh);
userRouter.get(`${rootPath}/user`, auth, getCurrentUser);
userRouter.get(`${rootPath}/logout`, logout);

export default userRouter;
