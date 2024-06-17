import { FC, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import user_photo from './../images/user-photo.png'
import classses from './RootLayout.module.css';

const RootLayout: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const loggedUser = JSON.parse(localStorage.getItem('authData') as string);
    const [actualLoggedUser, setActualLoggeduser] = useState(loggedUser);
    
    useEffect(() => {
        if(location.pathname === '/signup') return;
        if(!loggedUser?.token){
            navigate('/signin');
        }else {
            setActualLoggeduser(loggedUser);
        }
    }, [loggedUser?.token, location.pathname])

    const handleLogOut = () => {
        setActualLoggeduser({})
        localStorage.removeItem('authData');
    }
    return (
        <div className={classses.appContainer}>
            <nav className={classses.navigation}>
                <header>
                    <img src={user_photo} alt="" />
                    <h2 onClick={handleLogOut}>{actualLoggedUser?.username}</h2>
                </header>
                <ul>
                    <li>
                        <NavLink to={'users'}>Dodaj znajomych</NavLink>
                    </li>
                    <li>
                        <NavLink to={'chats'}>Zobacz konwersacje</NavLink>
                    </li>
                </ul>
            </nav>
            <Outlet/>
           
        </div>
    )
}

export default RootLayout;