import { ChangeEvent, FC, useRef, useState } from "react";
import IChat from "../../types/chatType";
import { URL } from "../../assets/utils";
import classes from './Chats.module.css';
import ChatItem from "./ChatItem";
import useFetch from "../../hooks/useFetch";
import AppError from "../Errors/appError";

const Chats: FC = () => {
    
    const loggedUser = JSON.parse(localStorage.getItem('authData') as string);
    const [searchUser, setSearchUser] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<number | null>(null);
    const searchUserRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newSearchValue = event.target.value;
    
        // Clear any existing timeout
        if (searchTimeout) {
          clearTimeout(searchTimeout);
        }
    
        // Schedule a new timeout to update searchUser after 1 second
        const timeoutId = setTimeout(() => {
          setSearchUser(newSearchValue);
        }, 1000);
    
        // Update searchTimeout state with the new timeout ID
        setSearchTimeout(timeoutId);
      };
      
    const {error, isFetching, fetchedData: chats} = useFetch<IChat[]>
    (async () => {
        const url = searchUser.trim().length > 0
        ? `${URL}chats/users?username=${searchUser}`
        : `${URL}chats/users`;
        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        });
        console.log(res);
        if(!res.ok) throw new AppError('Failed to fetch chats', res.status);
        const resData = await res.json();
        return resData.chats;
    }, [searchUser]
    );


    let content = <p>Loading...</p>;
    if(isFetching) content = <p>Loading...</p>;
    if(error){
        console.log(error);
        if(error.status === 404) content = <p>Chat not found</p>
        else content = <p>{error.message}</p>
    }
    else content = <>
    {
        chats && chats.map(chat => (
            <ChatItem 
                key={chat._id} 
                _id={chat._id} 
                users={chat.users} 
                lastMessage={chat.lastMessage} 
            />
        ))
    }
</>

    return (
        <aside className={classes.chats}>
            <input 
                type="text" 
                placeholder="Find chat" 
                onChange={handleChange}
                ref={searchUserRef}
            />
            <ul>
            {content}
            </ul>
            
        </aside>
    )
}

export default Chats;
