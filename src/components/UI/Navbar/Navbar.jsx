import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { getAuthToken } from '../../../utils/auth-utils';
import { action as logoutAction } from '../../../pages/Logout';
import { CurrentUserContext } from '../../../store/current-user-context';

import classes from './Navbar.module.css';

export default function Navbar() {
  const token = getAuthToken();
  const { user } = useContext(CurrentUserContext);

  return (
    <header>
      <nav className={classes.nav}>
        <Link className={classes['site-name']} to="/">
          <span className={classes.first}>Staff</span>
          <span className={classes.second}>Chain</span>
        </Link>
        <ul className={classes.list}>
          {user.isAdmin && token && (
            <>
              <li>
                <NavLink to="/user">Users</NavLink>
              </li>
              <li>
                <NavLink to="/process">Processes</NavLink>
              </li>
              <li>
                <NavLink to="/request">Requests</NavLink>
              </li>
            </>
          )}
          {token && (
            <>
              <li>
                <NavLink to="/process/available">Available Processes</NavLink>
              </li>
              <li>
                <NavLink to="/request/to-review">Requests to Review</NavLink>
              </li>
              <li>
                <NavLink to="/request/started">Started Requests</NavLink>
              </li>
              <li>
                <NavLink to="/me" className={classes.profile}>
                  {`${user.firstName} ${user.lastName}`}
                </NavLink>
              </li>
              <li>
                <NavLink to="/" onClick={() => logoutAction()}>
                  Logout
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
