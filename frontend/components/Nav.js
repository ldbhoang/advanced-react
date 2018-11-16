import { Fragment } from 'react';
import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import User from './User';
import SignOut from './SignOut';

const Nav = (props) => (
  <User>
    {(user) => (
      <NavStyles>
        <Link href='/items'>
          <a>Shop</a>
        </Link>
        {user && 
          <Fragment>
            <Link href='/sell'>
              <a>SELL</a>
            </Link>
            <Link href='/Orders'>
              <a>Orders</a>
            </Link>
            <Link href='/me'>
              <a>Account</a>
            </Link>
            <SignOut />
          </Fragment>
        }
        {!user && 
          <Link href='/signup'>
            <a>Signup</a>
          </Link>
        }
      </NavStyles>
    )}
  </User>
);

export default Nav;
