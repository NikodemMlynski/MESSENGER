import { FC } from "react";
import IMessage from "../../../types/messageType";
import classes from './MessageItem.module.css';
import { months } from "../../../assets/utils";

const MessageItem: FC<{message: IMessage}> = ({message}) => {
    {
        const hours = `${new Date(message.time).getHours()}`.padStart(2, '0');
        const minutes = `${new Date(message.time).getMinutes()}`.padStart(2, '0');
        const date = new Date(message.time).getDate();
        const month = months[new Date(message.time).getMonth()];
        return (
                
            <div key={message._id} className={message.isYourMessage ? classes.yourMessage : classes.friendMessage}>
                <section key={message._id}>
                    <p>{message.content}</p>
                    <span className={classes.date_span}><span>{` ${date} ${month}`}</span>{`${hours} : ${minutes}`}</span>
                </section>
            </div>
        )
            }
}

export default MessageItem;