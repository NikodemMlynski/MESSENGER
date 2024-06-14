import { FC } from "react";
import hamburger from './../../images/hamburger.png';
import IChat from "../../types/chatType";
import { Link, useParams } from "react-router-dom";
import classes from './ChatItem.module.css';

const ChatItem: FC<IChat> = ({_id, users, lastMessage}) => {
    const {chatId} = useParams();
    // "66683a3dbd86f63e2928ee3a"
    const user = users.find(user => user._id !== '66683a3dbd86f63e2928ee3a')
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