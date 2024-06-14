import { Router } from "express";
import { getAllChats, getAllChatsForUser, getChat } from "../controllers/chatController";
import { protect } from "../controllers/authController";

const router: Router = Router();
router.use(protect);

router
.route('/')
.get(getAllChats);

router
.route('/users')
.get(getAllChatsForUser);

router
.route('/:id')
.get(getChat);

export default router;