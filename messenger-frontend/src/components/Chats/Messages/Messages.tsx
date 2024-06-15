import { FC, useEffect, useState } from "react";
import classes from './Messages.module.css';
import IMessage from "../../../types/messageType";
import { NikodemToken, URL, months } from "../../../assets/utils";
import { ILoggedUser } from "../../../types/userType";

interface MessagesProps {
    chatId: string;
}

interface IMessagesInChat {
    yourMessages: IMessage[];
    friendMessages: IMessage[];
}

const Messages: FC<MessagesProps> = ({ chatId }) => {
    const [messagesForChat, setMessagesForChat] = useState<IMessage[]>([]);
    const loggedUser: ILoggedUser = JSON.parse(localStorage.getItem('authData') as string);

    const sortMessagesByDate = (messages: IMessage[]) => {
        return messages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    };

    const handleChangeMessages = (yourMessages: IMessage[], friendMessages: IMessage[]) => {
        let allMessages: IMessage[] = [];
        if (friendMessages.length > 0 && yourMessages.length > 0) {
            allMessages = [...yourMessages, ...friendMessages];
        } else if (friendMessages.length > 0) {
            allMessages = [...friendMessages];
        } else if (yourMessages.length > 0) {
            allMessages = [...yourMessages];
        }

        const sortedMessages = sortMessagesByDate(allMessages);
        setMessagesForChat(sortedMessages);
    };

    useEffect(() => {
        async function getMessagesForChat() {
            if(!chatId) return;
            const res = await fetch(`${URL}messages/chat/${chatId}`, {
                headers: {
                    'Authorization': `Bearer ${loggedUser.token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch messages for this chat');
            const resData: IMessagesInChat = await res.json();
            console.log(resData);
            
            const updatedYourMessages = resData.yourMessages.map(yMsg => {
                yMsg['isYourMessage'] = true;
                return yMsg;
            });
            
            handleChangeMessages(updatedYourMessages, resData.friendMessages);
        }
        getMessagesForChat();
    }, [chatId, loggedUser.token]);

    console.log(messagesForChat);

    return (
        <main className={classes.messagesContainer}>
            <nav className={classes.nav}>
                <h3>Username</h3>
            </nav>
            <article className={classes.messages}>
                {
                    messagesForChat.map(message => {
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
                    })
                }
            </article>
        </main>
    );
}

export default Messages;
