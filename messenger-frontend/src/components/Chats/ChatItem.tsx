import { FC } from "react";
import hamburger from './../../images/hamburger.png';
import IChat from "../../types/chatType";
import { Link } from "react-router-dom";
import classes from './ChatItem.module.css';
import { ILoggedUser } from "../../types/userType";

const ChatItem: FC<IChat> = ({_id, users}) => {
    // const {chatId} = useParams();
    const loggedUser: ILoggedUser = JSON.parse(localStorage.getItem('authData') as string);
    // "66683a3dbd86f63e2928ee3a"
    const user = users.find(user => user._id !== loggedUser.id);
    return (
        <li className={classes.chatItem}>
            <Link to={`/chats/${_id}`}>
                <div className={classes.imageContainer}>
                    <img src={hamburger} alt="" />

                </div>

                <p className={classes.chat_user_info}>
                    <strong>{user?.username}</strong>
                    <span className={classes.messages}>Ostatnia wiadomość</span>
                </p>
                
            </Link>
        </li>
    )
}

export default ChatItem;