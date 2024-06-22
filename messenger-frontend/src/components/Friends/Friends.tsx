import { FC, useState } from 'react';
import classes from './Friends.module.css';
import { ILoggedUser, IUserGet } from '../../types/userType';
import { URL } from '../../assets/utils';
import FriendItem from './FriendItem';
import useFetch from '../../hooks/useFetch';
import AppError from '../Errors/appError';


const Friends: FC = () => {
    const [notInFriends, setNotInFriends] = useState<IUserGet[]>([]);
    const [friends, setFriends] = useState<IUserGet[]>([]);
    const loggedUser: ILoggedUser = JSON.parse(localStorage.getItem('authData') as string);

    const {error: notInFriendsError, isFetching: notInFriendsIsFetching} = useFetch<IUserGet[]>
    (async () => {
        const res = await fetch(`${URL}users/not-in-friends`, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        })

        if(!res.ok) throw new AppError('Failed to fetch person not in your friends', res.status);
        const resData = await res.json();
        setNotInFriends(resData.data.notInFriends);
        return resData.data.notInFriends;
    }, [loggedUser.token]);

    const {error: friendsError, isFetching: friendsIsFetching} = useFetch<IUserGet[]>
    (async () => {
        const res = await fetch(`${URL}users/friends`, {
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            }
        })
        if(!res.ok) throw new AppError('Failed to fetch your friends', res.status);
        const resData = await res.json();
        setFriends(resData.data.friends);
        return resData.data.friends;
    }, [loggedUser.token]);

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

    let friendsContent = <p>Loading...</p>
    if(friendsIsFetching) friendsContent = <p>Loading...</p>
    if(friendsError) {
        if(friendsError.status === 404) friendsContent = <p>Friends not found</p>
        else friendsContent = <p>{friendsError.message}</p>
    }else friendsContent = <>
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
    </>

    let notInFriendsContent = <p>Loading...</p>
    if(notInFriendsIsFetching) notInFriendsContent = <p>Loading...</p>
    if(notInFriendsError) {
        if(notInFriendsError.status === 404) notInFriendsContent = <p>Person who are not in your friends not found</p>
        else notInFriendsContent = <p>{notInFriendsError.message}</p>
    }else notInFriendsContent = <>
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
    </>
    console.log(friendsContent);
    return (
        <main className={classes.main}>
            <section className={classes.notInFriends}>
                <h2>Twoi znajomi</h2>
                <ul>
                    {
                        friendsContent
                    }
                </ul>
            </section>
            <section className={classes.friends}>
                <h2>Osoby które możesz znać</h2>
                <ul>
                    {
                        notInFriendsContent
                    }
                </ul>
            </section>
        </main>
    )
};
export default Friends;