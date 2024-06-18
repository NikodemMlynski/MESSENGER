import { FC, FormEvent, useState } from "react";
import IMessage from "../../../types/messageType";
import classes from './MessageItem.module.css';
import { URL, months } from "../../../assets/utils";
import MessageToolbox from "./MessageToolbox";
import { ILoggedUser } from "../../../types/userType";

const MessageItem: FC<{message: IMessage; onDeleteMessage: (id: string) => void; onEditMessage: (id: string, content: string) => void }> = ({message, onDeleteMessage, onEditMessage}) => {
    {
        const [toolboxOpened, setToolboxOpened] = useState(false);
        const [isopenEditInput, setIsOpenEditInput] = useState(false);
        const loggedUser: ILoggedUser = JSON.parse(localStorage.getItem('authData') as string);

        const hours = `${new Date(message.time).getHours()}`.padStart(2, '0');
        const minutes = `${new Date(message.time).getMinutes()}`.padStart(2, '0');
        const date = new Date(message.time).getDate();
        const month = months[new Date(message.time).getMonth()];

        const handleToolboxOpen = () => {
            setToolboxOpened(prevState => !prevState);
        }

        const handleOpenInput = () => {
            setIsOpenEditInput(prevState => !prevState); 
        } 

        const editMessage = async (id: string, content: string) => {
            const res = await fetch(`${URL}messages/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${loggedUser.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({content})
            })
            if(!res.ok) throw new Error('Failed to edit this message');
            const resData = await res.json();
            console.log(resData);
        }
        const handleEditSubmit = (e: FormEvent) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const editedMessage = formData.get('editedMessage') as string;
            onEditMessage(message._id, editedMessage);
            editMessage(message._id, editedMessage);
            handleOpenInput();

        }    
        
        return (
                
            <div key={message._id} className={message.isYourMessage ? classes.yourMessage : classes.friendMessage}>
                <section key={message._id}>
                    <p id="message" onClick={handleToolboxOpen}>{message.content}</p>
                    {toolboxOpened && isopenEditInput && (
                        <form className={classes.editMessageForm} onSubmit={handleEditSubmit}>
                            <input defaultValue={message.content} name="editedMessage" />
                            <button>edit</button>
                        </form>
                    )}
                    <span className={classes.date_span}><span>{` ${date} ${month}`}</span>{`${hours} : ${minutes}`}</span>
                    <MessageToolbox openInput={handleOpenInput} onDeleteMessage={onDeleteMessage} messageId={message._id} isOpened={toolboxOpened} isYour={message.isYourMessage ?? false}/>
                </section>
            </div>
        )
            }
}

export default MessageItem;