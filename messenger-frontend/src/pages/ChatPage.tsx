import { FC } from "react";
import Chats from "../components/Chats/Chats";
import classes from './ChatsContainer.module.css';
import Messages from "../components/Chats/Messages/Messages";
import { useParams } from "react-router-dom";

const ChatPage: FC = () => {
    const {chatId} = useParams();
    return (
        <main className={classes.main_container}>
            <Chats/>
            <Messages chatId={chatId}/>
        </main>
    )
}
export default ChatPage;