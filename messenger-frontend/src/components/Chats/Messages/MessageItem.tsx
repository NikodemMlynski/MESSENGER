import { FC, useState } from "react";
import IMessage from "../../../types/messageType";
import classes from './MessageItem.module.css';
import { months } from "../../../assets/utils";
import MessageToolbox from "./MessageToolbox";

const MessageItem: FC<{message: IMessage; onDeleteMessage: (id: string) => void; onEditMessage: (id: string, content: string) => void }> = ({message, onDeleteMessage, onEditMessage}) => {
    {
        const [toolboxOpened, setToolboxOpened] = useState(false);

        const hours = `${new Date(message.time).getHours()}`.padStart(2, '0');
        const minutes = `${new Date(message.time).getMinutes()}`.padStart(2, '0');
        const date = new Date(message.time).getDate();
        const month = months[new Date(message.time).getMonth()];
        const handleToolboxOpen = () => {
            setToolboxOpened(prevState => !prevState);
        }
        return (
                
            <div key={message._id} className={message.isYourMessage ? classes.yourMessage : classes.friendMessage}>
                <section key={message._id}>
                    <p onClick={handleToolboxOpen}>{message.content}</p>
                    <span className={classes.date_span}><span>{` ${date} ${month}`}</span>{`${hours} : ${minutes}`}</span>
                    <MessageToolbox onEditMessage={onEditMessage} onDeleteMessage={onDeleteMessage} messageId={message._id} isOpened={toolboxOpened} isYour={message.isYourMessage ?? false}/>
                </section>
            </div>
        )
            }
}

export default MessageItem;