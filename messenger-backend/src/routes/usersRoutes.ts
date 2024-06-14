import { Request, Response, Router } from "express";
import { addFriend, deleteFriend, deleteUser, getAllFriends, getAllNotInFriends, getAllUsers, getUser, updateUser } from "../controllers/userController";
import { protect, signIn, signUp } from "../controllers/authController";
const router: Router = Router();


router
.route('/')
.get(getAllUsers)

router
.route('/signup')
.post(signUp);

router
.route('/signin')
.post(signIn);

router.use(protect);

router
.route('/friends')
.get(getAllFriends);

router
.route('/not-in-friends')
.get(getAllNotInFriends)



router
.route('/:id')
.patch(updateUser)
.get(getUser)
.delete(deleteUser)

router
.route('/:id/friends/:friendId')
.patch(addFriend);

router
.route('/:id/friends/:friendId/delete')
.patch(deleteFriend);





export default router;