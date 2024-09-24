import { FC, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import user_photo from './../images/user-photo.png'
import classses from './RootLayout.module.css';
import { ILoggedUser } from "../types/userType";

const RootLayout: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const loggedUser: ILoggedUser = JSON.parse(localStorage.getItem('authData') as string);
    const [actualLoggedUser, setActualLoggeduser] = useState(loggedUser);
    
    useEffect(() => {
        if(!loggedUser?.token && !(location.pathname === '/signup') && !(location.pathname === '/signin')) {
            navigate('/signin');
            // alert('robi sie');
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
            {!(!loggedUser?.token && !(location.pathname === '/signup') && !(location.pathname === '/signin')) && <Outlet/>}
           
        </div>
    )
}

export default RootLayout;