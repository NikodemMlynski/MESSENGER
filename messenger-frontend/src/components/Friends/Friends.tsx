import { FC, useEffect, useState } from 'react';
import classes from './Friends.module.css';
import { ILoggedUser, IUserGet } from '../../types/userType';
import { URL } from '../../assets/utils';
import FriendItem from './FriendItem';


const Friends: FC = () => {
    const [notInFriends, setNotInFriends] = useState<IUserGet[]>([]);
    const [friends, setFriends] = useState<IUserGet[]>([]);
    const loggedUser: ILoggedUser = JSON.parse(localStorage.getItem('authData') as string);
    useEffect(() => {
        async function getNotInFriends(){
            try {
                const res = await fetch(`${URL}users/not-in-friends`, {
                    headers: {
                        'Authorization': `Bearer ${loggedUser.token}`
                    }
                })

                if(!res.ok) throw new Error('Failed to fetch person not in your friends');
                const resData = await res.json();
                console.log(resData);
                setNotInFriends(resData.data.notInFriends);
            } catch (error) {
                console.log(error);
            }
        }
        getNotInFriends();
    }, [loggedUser.token])
    useEffect(() => {
        async function getFriends() {
            try {
                const res = await fetch(`${URL}users/friends`, {
                    headers: {
                        'Authorization': `Bearer ${loggedUser.token}`
                    }
                })
                if(!res.ok) throw new Error('Failed to fetch your friends');
                const resData = await res.json();
                setFriends(resData.data.friends);
            } catch (error) {
                console.log(error);
            }
        }
        getFriends();
    }, [loggedUser.token])

    const handleAddToFriends = (id: string) => {
        const friendObj: IUserGet = notInFriends.find(f => f._id === id) as IUserGet;
        setNotInFriends(prevState => prevState.filter(f => f._id !== id))
        setFriends(prevState => [...prevState, friendObj]);
    }

    const handleDeleteFromFriends = (id: string) => {
        const friendObj: IUserGet = friends.find(f => f._id === id) as IUserGet;
        setFriends(prevState => prevState.filter(f => f._id !== id))
        setNotInFriends(prevState => [...prevState, friendObj]);
    }

    console.log(friends);
    return (
        <main className={classes.main}>
            <section className={classes.notInFriends}>
                <h2>Twoi znajomi</h2>
                <ul>
                    {
                        friends.map(user => (
                            <FriendItem key={user._id}
                            user={user}
                            isFriend={true}
                            onAddToFriends={handleAddToFriends}
                            onDeleteFromFriends={handleDeleteFromFriends}
                              />

                        ))
                    }
                </ul>
            </section>
            <section className={classes.friends}>
                <h2>Osoby które możesz znać</h2>
                <ul>
                    {
                        notInFriends.map(user => (
                            <FriendItem key={user._id}
                            user={user}
                            isFriend={false}
                            onAddToFriends={handleAddToFriends}
                            onDeleteFromFriends={handleDeleteFromFriends}
                            />
                        ))
                    }
                </ul>
            </section>
        </main>
    )
};
export default Friends;