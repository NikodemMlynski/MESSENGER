import { Router } from "express";
import { protect } from "../controllers/authController";
import { deleteMessage, getMessagesForUser, getMessagesInChat, sendMessage, updateMessage } from "../controllers/messageController";

const router: Router = Router();

// TODO:
// dodanie wysyłania wiadomości (można wysłać wiadomość tylko jeżeli ma się użytkownika w znajomych)
// dodanie otrzymywania wiadomości od wszystkich (wyświetla tylko wszystkie osoby które kiedykolwiek wysłały Ci wiadomość i ostatnią wiadomość w konwersacji)
// dodanie otrzymywania wiadomości od jednego użytkownika(wyświetla wszystkie wiadomości);
// dodanie usuwania wiadomości
// dodanie modyfikowania wiadomości

router.use(protect);

router
.route('/user/:id')
.get(getMessagesForUser)
.post(sendMessage);

router
.route('/:id')
.patch(updateMessage)
.delete(deleteMessage);
// tutaj trzeba dodać modyfikacje i usuwanie wiadomości po id wiadomości

router
.route('/chat/:chatId')
.get(getMessagesInChat);


export default router;