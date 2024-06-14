import { FC } from "react";
import { NavLink, Outlet } from "react-router-dom";

import classses from './RootLayout.module.css';

const RootLayout: FC = () => {
    return (
        <div className={classses.appContainer}>
            <nav className={classses.navigation}>
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