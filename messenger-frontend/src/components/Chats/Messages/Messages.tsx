import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import classes from './Messages.module.css';
import IMessage from "../../../types/messageType";
import { URL } from "../../../assets/utils";
import { ILoggedUser } from "../../../types/userType";
import MessageItem from "./MessageItem";
import useFetch from "../../../hooks/useFetch";

interface MessagesProps {
    chatId: string;
}
interface IUserInMessage{
    _id: string;
    username: string;
}
interface IMessagesInChat {
    yourMessages: IMessage[];
    friendMessages: IMessage[];
    users: IUserInMessage[];
}

const Messages: FC<MessagesProps> = ({ chatId }) => {
    const [messagesForChat, setMessagesForChat] = useState<IMessage[]>([]);
    const loggedUser: ILoggedUser = JSON.parse(localStorage.getItem('authData') as string);
    const [messageData, setMessageData] = useState({
        receiver: {
            id: '',
            username: ''
        },
        message: '',
    });

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
    const {error, isFetching} = useFetch<IMessage[]>(async function getMessagesForChat() {
        if(!chatId) return;
        const res = await fetch(`${URL}messages/chat/${chatId}`, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });
        if (!res.ok) throw new Error('Failed to fetch messages for this chat');
        const resData: IMessagesInChat = await res.json();
        const findedReceiver = resData.users.find(u => u._id !== loggedUser.id);
        setMessageData(prevState => ({
            ...prevState,
            receiver: findedReceiver
              ? { id: findedReceiver._id, username: findedReceiver.username }
              : { id: '', username: '' }, // Set default values if not found
          }));
        
        const updatedYourMessages = resData.yourMessages.map(yMsg => {
            yMsg['isYourMessage'] = true;
            return yMsg;
        });
        
        handleChangeMessages(updatedYourMessages, resData.friendMessages);
    }, [chatId, loggedUser.token]);

    const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
        setMessageData(prevState => ({...prevState, ['message']: e.target?.value}));
    }
    const handleSendMessage = () => {
        if(messageData.message.trim().length === 0) return;
        sendMessageDB(messageData.message, messageData.receiver.id);
        const messageObj: IMessage = {
            _id: (Math.random()*10).toString(),
            chatId: chatId,
            sender: loggedUser.id,
            receiver: messageData.receiver.id,
            time: new Date(),
            read: false,
            isYourMessage: true,
            content: messageData.message
        }
        setMessagesForChat(prevState => [...prevState, messageObj]);
        setMessageData(prevState => ({...prevState, ['message']: ''}))
    }

    const handleDeleteMessage = (id: string) => {
        setMessagesForChat(prevState => prevState.filter(message => message._id !== id));
    }

    const handleEditMessage = (id: string, content: string) => {
        const messageIndex = messagesForChat.findIndex(m => m._id === id);
        setMessagesForChat(prevState => {
            prevState[messageIndex].content = content;
            return [...prevState];
        })
    }

    const sendMessageDB = async (content: string, receiverId: string) => {
        try {
            const res = await fetch(`${URL}messages/user/${receiverId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loggedUser.token}`
                },
                body: JSON.stringify({content})
            })
            if(!res.ok) throw new Error('Failed to send message');
        } catch (error) {
            console.log(error);
        }
    }
    let content;
    if(isFetching) content = <p>Loading...</p>
    if(error) content = <p>{error.message} - {error.status}</p>
    else content = <>
    {messagesForChat.map(message => <MessageItem onDeleteMessage={handleDeleteMessage} onEditMessage={handleEditMessage} key={message._id} message={message}/>)}
    </>
    return (
        <main className={classes.messagesContainer}>
            <nav className={classes.nav}>
                <h3>{messageData.receiver.username}</h3>
            </nav>
            <article className={classes.messages}>
                {
                    content
                }
            </article>
            <section className={classes.messageForm}>
                <input type="text" placeholder="Aa" value={messageData.message} onChange={handleChangeMessage}/>
                <button onClick={handleSendMessage}>Wyślij</button>
            </section>
        </main>
    );
}

export default Messages;
