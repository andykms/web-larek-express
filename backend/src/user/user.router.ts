import { Router } from 'express';
import { login, register, refresh, getCurrentUser, logout } from './user.controller';

const rootPath = '/auth';

const router = Router();

router.post(`${rootPath}/register`, register);
router.post(`${rootPath}/login`, login);
router.post(`${rootPath}/refresh`, refresh);
router.get(`${rootPath}/user`, getCurrentUser);
router.post(`${rootPath}/logout`, logout);

export default router;
