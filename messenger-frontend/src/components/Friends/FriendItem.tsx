import { FC } from 'react';
import classes from './FriendItem.module.css';
import { ILoggedUser, IUserGet } from '../../types/userType';
import { URL } from '../../assets/utils';
import user_photo from './../../images/user-photo.png'

const FriendItem: FC<{
    user: IUserGet,
    isFriend: boolean,
    onAddToFriends: (id: string) => void,
    onDeleteFromFriends: (id: string) => void

    }> = ({user, isFriend, onAddToFriends, onDeleteFromFriends}) => {
    const loggedUser: ILoggedUser = JSON.parse(localStorage.getItem('authData') as string);

    const addOrDeleteFriend = async (friendId: string, type: 'ADD' | 'DELETE') => {
        try {
            const url = type === 'ADD'
                ? `${URL}users/${loggedUser.id}/friends/${friendId}/`
                : `${URL}users/${loggedUser.id}/friends/${friendId}/delete`;

            const res = await fetch(url, {
                // '/:id/friends/:friendId'
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${loggedUser.token}`
                }
            })
            if(!res.ok) throw new Error('Failed to add user to friend');
            const resData = await res.json();
            console.log(resData);
        } catch (error) {
            console.log(error);
        }
    }


    const handleAddToFriends = async (friendId: string) => {
        onAddToFriends(friendId);
        addOrDeleteFriend(friendId, 'ADD')
    }

    const handleDeleteFromFriends = (friendId: string) => {
        onDeleteFromFriends(friendId);
        addOrDeleteFriend(friendId, 'DELETE');
    }
    return (
        <li className={classes.friendItem}>
            <img src={user_photo} alt="" />
            <h3>{user.username}</h3>
            <p>{user.email}</p>
            {
                isFriend ? (
                    <button className={classes.delete} onClick={() => handleDeleteFromFriends(user._id)}>Usuń ze znajomych</button>
                ) : (
                    <button className={classes.add} onClick={() => handleAddToFriends(user._id)}>Dodaj do znajomych</button>
                )
            }
        </li>
)
}
export default FriendItem;