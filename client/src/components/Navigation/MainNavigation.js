import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import './mainNavigation.css';

const MainNavigation = () => {
  const authContext = useContext(AuthContext);
  
  return (
    <header className='main-navigation'>
      <div className='main-navigation__logo'>
        <h1>EventHandler</h1>
      </div>
      <nav className='main-navigation__items'>
        <ul>
          <li>
            <NavLink to='/events'>Events</NavLink>
          </li>
          {authContext.token && (
            <>
              <li>
                <NavLink to='/bookings'>Bookings</NavLink>
              </li>
              <li>
                <NavLink to='/'>
                  <button onClick={authContext.logout}>Logout</button>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
