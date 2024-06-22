import { FC } from "react"
import classes from './MessageToolbox.module.css';
import editIcon from './../../../images/pencil.png';
import deleteIcon from './../../../images/delete.png';
import emojiIcon from './../../../images/happy.png';
import { URL } from "../../../assets/utils";
import { ILoggedUser } from "../../../types/userType";
import { EmoticonType } from "../../../types/messageType";

const MessageToolbox: FC<
    {
    messageId: string, isOpened: boolean,
    isYour: boolean,
    onDeleteMessage: (id: string) => void,
    openInput: () => void,
    onReactOnMessage: (id: string, reactIcon: EmoticonType) => void
    }> = ({messageId, isOpened, isYour, onDeleteMessage, openInput, onReactOnMessage}) => {
    const loggedUser: ILoggedUser = JSON.parse(localStorage.getItem('authData') as string);

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
    const handleEdit = () => {
        openInput();
    }
    const handleDelete = (id: string) => {
        onDeleteMessage(id);
        deleteMessage(id);
        // trzeba jeszcze usunąć wiadomość na frontendzie po stronie klienta
        // I have to also delete message in frontend in client side
    }
    const handleReact = (id: string, emojiType: EmoticonType) => {
        react(id, emojiType);
        onReactOnMessage(id, emojiType)
    }
    const react = async (id: string, emojiType: EmoticonType) => {
        try {
            const res = await fetch(`${URL}messages/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({react: emojiType}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loggedUser.token}`
                }
            });
            if(!res.ok) throw new Error('Failed to react this message');

            const resData = await res.json();
            console.log(resData);
        } catch (error) {
            console.log(error);
        }
    }
    const display = isOpened ? 'flex' : 'none';
    return (
        <div className={classes.toolbox} style={isYour ? {left: '-8.5rem', display: display} : {right: '-8.5rem', display: display}}>
            <button onClick={() => handleEdit()}><img className={classes.toolbox_image} src={editIcon} alt="edit" /></button>
            <button onClick={() => handleDelete(messageId)}><img className={classes.toolbox_image} src={deleteIcon} alt="delete" /></button>
            <button onClick={() => handleReact(messageId, 'happy')}><img className={classes.toolbox_image} src={emojiIcon} alt="emoji" /></button>
        </div>
    )
}
export default MessageToolbox;