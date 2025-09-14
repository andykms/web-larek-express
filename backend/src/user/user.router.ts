import { Router } from 'express';

const rootPath = '/auth';

const router = Router();

router.post(`${rootPath}/register`);
router.post(`${rootPath}/login`);

export default router;
