import { Link, NavLink } from 'react-router-dom';
import { getAuthToken } from '../../../utils/auth-utils';
import { action as logoutAction } from '../../../pages/Logout';

import classes from './Navbar.module.css';

export default function Navbar() {
  const token = getAuthToken();

  return (
    <header>
      <nav className={classes.nav}>
        <Link className={classes['site-name']} to="/">
          {process.env.REACT_APP_NAME}
        </Link>
        <ul className={classes.list}>
          {token && (
            <>
              <li>
                <NavLink to="/me">Profile</NavLink>
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
