import { FC, Fragment, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import logo from '../assets/logo.png';
import { BASE_API_IMAGE_url } from '../utils/api';
import { useAppSelector } from '../store/store';

interface NavbarPropTypes {
  logoutHandler: () => void;
}

const Navbar: FC<NavbarPropTypes> = ({ logoutHandler }) => {
  const user = useAppSelector((state) => state.user.user);
  const isAuth = useAppSelector((state) => state.user.isAuth);

  const navigate = useNavigate();
  return (
    <Container>
      <div className="linkContainer leftSide">
        <div className="logo-container" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" />
        </div>
        <span className="link">
          <Link to="/">Home</Link>
        </span>
        {isAuth && (
          <Fragment>
            <span className="link">
              <Link to="/create-post">Create a Post</Link>
            </span>
            <span className="link">
              <Link to="/myposts">My Posts</Link>
            </span>
            <span className="link">
              <Link to="/edit-avatar">Edit avatar</Link>
            </span>
          </Fragment>
        )}
      </div>

      <div className="linkContainer RightSide">
        {!isAuth ? (
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
            {isAuth && user && (
              <span className="link user">
                <img
                  src={`${BASE_API_IMAGE_url}/${user.avatar}`}
                  alt={user.name}
                />
                <span>{user.name}</span>
              </span>
            )}
          </Fragment>
        )}
      </div>
    </Container>
  );
};

export default Navbar;

const Container = styled.nav`
  --nav-height: 4rem;
  height: var(--nav-height);
  width: 100%;
  position: fixed;
  z-index: 900;
  padding: 0 6rem;
  background-color: var(--primary-purple);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .logo-container {
    height: var(--nav-height);
    width: var(--nav-height);
    display: flex;
    padding: 0.2rem;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    img {
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
    .user {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: default;
      img {
        padding: 0.5rem 0.5rem;
        height: var(--nav-height);
        width: var(--nav-height);
        object-fit: cover;
        border-radius: 50%;
        cursor: default;
      }
    }
  }
  .RightSide {
    justify-content: flex-end;
  }
`;
