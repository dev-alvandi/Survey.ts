import { FC, Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import logo from '../assets/logo.png';

interface NavbarPropTypes {
  isLogged: boolean;
  logoutHandler: () => void;
}

const Navbar: FC<NavbarPropTypes> = ({ isLogged, logoutHandler }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isLogged) {
      const name = localStorage.getItem('userName');
      console.log(name);
      setName(name!);
    }
  }, []);

  return (
    <Container>
      <div className="linkContainer leftSide">
        <span className="link">
          <Link to="/">Home</Link>
        </span>
        {isLogged && (
          <Fragment>
            <span className="link">
              <Link to="/create-post">Create a Post</Link>
            </span>
            <span className="link">
              <Link to="/myposts">My Posts</Link>
            </span>
          </Fragment>
        )}
      </div>
      <div className="logo-container">
        <img src={logo} alt="Logo" />
      </div>
      <div className="linkContainer RightSide">
        {!isLogged ? (
          <Fragment>
            <span className="link">
              <Link to="register">Register</Link>
            </span>
            <span className="link">
              <Link to="login">Login</Link>
            </span>
          </Fragment>
        ) : (
          <Fragment>
            <span className="link" onClick={logoutHandler}>
              Logout
            </span>
            {name.length > 0 && <span className="user-name">{name}</span>}
          </Fragment>
        )}
      </div>
    </Container>
  );
};

export default Navbar;

const Container = styled.nav`
  height: 4rem;
  padding: 0 6rem;
  background-color: var(--primary-purple);
  display: grid;
  grid-template-columns: 1fr 4rem 1fr;
  align-items: center;
  .logo-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .linkContainer {
    display: flex;
    gap: 2rem;
    .link,
    a {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #e5e5e5;
      transition: color 0.15s ease-in-out;
      &:hover {
        color: #fff;
      }
    }
    .user-name {
      padding: 0.5rem 0.5rem;
      background-color: #fff;
      border-radius: 0.2rem;
    }
  }
  .RightSide {
    justify-content: flex-end;
  }
`;
