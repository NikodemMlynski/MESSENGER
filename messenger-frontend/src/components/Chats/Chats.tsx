import { FC, useEffect, useState } from "react";
import IChat from "../../types/chatType";
import { NikodemToken, URL } from "../../assets/utils";
import classes from './Chats.module.css';
import ChatItem from "./ChatItem";

const Chats: FC = () => {
    const [chats, setChats] = useState<IChat[]>([]);
    const loggedUser = JSON.parse(localStorage.getItem('authData') as string);

    useEffect(() => {
        async function getChats() {
            const res = await fetch(`${URL}chats/users`, {
                headers: {
                    'Authorization': `Bearer ${loggedUser.token}`
                }
            });
            if(!res.ok) throw new Error('Failed to fetch chats data');
            const resData = await res.json();
            console.log(resData.chats);
            setChats(resData.chats);
        }
        getChats();
    }, []);
    return (
        <aside className={classes.chats}>
            <ul>

            {
                chats.map(chat => (
                    <ChatItem key={chat._id} _id={chat._id} users={chat.users} lastMessage={chat.lastMessage}/> // tutaj bedzie trzeba zrobic komponent chatu, ktory bedzie wyswietlal tylko uzytkownika ktory nie jest zalogowany
                ))
            }
            </ul>
        </aside>
    )
}

export default Chats;