import { FC } from "react"
import classes from './MessageToolbox.module.css';
import editIcon from './../../../images/pencil.png';
import deleteIcon from './../../../images/delete.png';
import emojiIcon from './../../../images/happy.png';
import { URL } from "../../../assets/utils";
import { ILoggedUser } from "../../../types/userType";
type emoji = 'happy' | 'sad' | 'angry' | 'sigma' | 'alcohol';

const MessageToolbox: FC<
    {
    messageId: string, isOpened: boolean,
    isYour: boolean,
    onDeleteMessage: (id: string) => void,
    onEditMessage: (id: string, content: string) => void
    }> = ({messageId, isOpened, isYour, onDeleteMessage, onEditMessage}) => {
    const loggedUser: ILoggedUser = JSON.parse(localStorage.getItem('authData') as string);

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

    const deleteMessage = async (id: string) => {
        try {
            const res = await fetch(`${URL}messages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${loggedUser.token}`
                }
            });

            if(!res.ok) throw new Error('Failed to delete this message');
            const resData = await res.json();
            console.log(resData)

        } catch (error) {
            console.log(error);
        }
    }
    const handleEdit = (id: string) => {
        alert('trzeba dodać jakiegoś inputa z możliwością wpisania contentu wiadomości, żeby można było wpisać coś dynamicznego')
        onEditMessage(id, 'zmieniona wiadomosc');
        editMessage(id, 'zmieniona wiadomosc');
    }
    const handleDelete = (id: string) => {
        onDeleteMessage(id);
        deleteMessage(id);
        // trzeba jeszcze usunąć wiadomość na frontendzie po stronie klienta
        // I have to also delete message in frontend in client side
    }
    const handleReact = (id: string, emojiType: emoji) => {
        alert(id);

    }
    const display = isOpened ? 'flex' : 'none';
    return (
        <div className={classes.toolbox} style={isYour ? {left: '-8.5rem', display: display} : {right: '-8.5rem', display: display}}>
            <button onClick={() => handleEdit(messageId)}><img className={classes.toolbox_image} src={editIcon} alt="edit" /></button>
            <button onClick={() => handleDelete(messageId)}><img className={classes.toolbox_image} src={deleteIcon} alt="delete" /></button>
            <button onClick={() => handleReact(messageId, 'happy')}><img className={classes.toolbox_image} src={emojiIcon} alt="emoji" /></button>
        </div>
    )
}
export default MessageToolbox;