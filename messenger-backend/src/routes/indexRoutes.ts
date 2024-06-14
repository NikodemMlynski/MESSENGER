import { Router, Request, Response } from "express";
import messageRouter from './messagesRoutes';
import chatRouter from './chatRoutes';
import usersRouter from './usersRoutes';
const router: Router = Router();

router.use('/messages', messageRouter);
router.use('/users', usersRouter);
router.use('/chats', chatRouter);

export default router;