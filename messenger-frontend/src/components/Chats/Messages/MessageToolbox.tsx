import { FC } from "react"
import classes from './MessageToolbox.module.css';
import editIcon from './../../../images/pencil.png';
import deleteIcon from './../../../images/delete.png';
import emojiIcon from './../../../images/happy.png';
type emoji = 'happy' | 'sad' | 'angry' | 'sigma' | 'alcohol';

const MessageToolbox: FC<{messageId: string, isOpened: boolean, isYour: boolean}> = ({messageId, isOpened, isYour}) => {
    const handleEdit = (id: string) => {

    }
    const handleDelete = (id: string) => {

    }
    const handleReact = (id: string, emojiType: emoji) => {

    }
    const display = isOpened ? 'flex' : 'none';
    return (
        <div className={classes.toolbox} style={isYour ? {left: '-8.5rem', display: display} : {right: '-8.5rem', display: display}}>
            <button onClick={() => handleEdit('id')}><img className={classes.toolbox_image} src={editIcon} alt="edit" /></button>
            <button onClick={() => handleDelete('id')}><img className={classes.toolbox_image} src={deleteIcon} alt="delete" /></button>
            <button onClick={() => handleReact('id', 'happy')}><img className={classes.toolbox_image} src={emojiIcon} alt="emoji" /></button>
        </div>
    )
}
export default MessageToolbox;