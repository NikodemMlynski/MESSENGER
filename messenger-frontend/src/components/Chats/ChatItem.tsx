import { FC } from "react";
import user_photo from './../../images/user-photo.png';
import IChat from "../../types/chatType";
import { NavLink } from "react-router-dom";
import classes from './ChatItem.module.css';
import { ILoggedUser } from "../../types/userType";
import { truncateString } from "../../assets/utils";

const ChatItem: FC<IChat> = ({_id, users, lastMessage}) => {
    // const {chatId} = useParams();
    const loggedUser: ILoggedUser = JSON.parse(localStorage.getItem('authData') as string);
    // "66683a3dbd86f63e2928ee3a"
    const user = users.find(user => user._id !== loggedUser.id);
    return (
        <li className={classes.chatItem} >
            <NavLink to={`/chats/${_id}`} className={({isActive}) => isActive ? classes.active : ""}>
                <div className={classes.imageContainer}>
                    <img src={user_photo} alt="" />

                </div>

                <p className={classes.chat_user_info}>
                    <strong>{user?.username}</strong>
                    <span className={classes.messages}>{truncateString(lastMessage?.content ? lastMessage?.content : '')}</span>
                </p>
                
            </NavLink>
        </li>
    )
}

export default ChatItem;