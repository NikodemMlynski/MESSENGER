import { FC, useEffect, useState } from "react";
import IChat from "../../types/chatType";
import { URL } from "../../assets/utils";
import classes from './Chats.module.css';
import ChatItem from "./ChatItem";

const Chats: FC = () => {
    const [chats, setChats] = useState<IChat[]>([]);
    const loggedUser = JSON.parse(localStorage.getItem('authData') as string);
    const [searchUser, setSearchUser] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        async function getChats() {
            const url = searchUser.trim().length > 0
            ? `${URL}chats/users?username=${searchUser}`
            : `${URL}chats/users`;
            const res = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${loggedUser.token}`
                }
            });
            if(!res.ok) throw new Error('Failed to fetch chats data');
            const resData = await res.json();
            console.log(resData);
            console.log(resData.chats);
            setChats(resData.chats);
        }

        // Używamy setTimeout, aby wykonać zapytanie po 1 sekundzie
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeoutId = setTimeout(() => {
            getChats();
        }, 1000);

        setSearchTimeout(timeoutId);

        // Czyszczenie timeoutu po unmount lub po zmianie searchUser
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchUser]);

    return (
        <aside className={classes.chats}>
            <input 
                type="text" 
                placeholder="Find chat" 
                value={searchUser} 
                onChange={(e) => setSearchUser(e.target.value)}
            />
            <ul>
                {
                    chats.map(chat => (
                        <ChatItem 
                            key={chat._id} 
                            _id={chat._id} 
                            users={chat.users} 
                            lastMessage={chat.lastMessage} 
                        />
                    ))
                }
            </ul>
        </aside>
    )
}

export default Chats;
