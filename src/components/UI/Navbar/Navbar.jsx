import { Link } from 'react-router-dom';
import classes from './Navbar.module.css';

export default function Navbar() {
  return (
    <header>
      <nav className={classes.nav}>
        <Link className={classes['site-name']} to="/">
          {process.env.REACT_APP_NAME}
        </Link>
      </nav>
    </header>
  );
}
