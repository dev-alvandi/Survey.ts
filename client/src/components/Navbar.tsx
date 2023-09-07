import { FC, Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineLogin } from 'react-icons/ai';
import styled from 'styled-components';

import logo from '../assets/logo.png';
import { BASE_API_IMAGE_url } from '../utils/api';
import { useAppSelector } from '../store/store';

interface NavbarPropTypes {
  logoutHandler: () => void;
}

const Navbar: FC<NavbarPropTypes> = ({ logoutHandler }) => {
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.user.user);
  const isAuth = useAppSelector((state) => state.user.isAuth);

  const [isMenuShown, setIsMenuShown] = useState(false);
  const [isAuthShown, setIsAuthShown] = useState(false);
  const [isUserLinkShown, setIsUserLinkShown] = useState(false);

  return (
    <Container>
      <div className="linkContainer leftSide">
        <div
          className="mobile-nav"
          onClick={() => setIsMenuShown((prevState) => !prevState)}>
          <div className={`hamburger ${isMenuShown ? 'clicked' : ''}`}>
            <span className="line top-line"></span>
            <span className="line bottom-line"></span>
          </div>
          {isMenuShown && (
            <div className="menu-container">
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
                </Fragment>
              )}
            </div>
          )}
        </div>
        <div className="logo-container" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" />
        </div>
        <div className="desktop-nav">
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
            </Fragment>
          )}
        </div>
      </div>

      <div className="linkContainer RightSide">
        {!isAuth ? (
          <Fragment>
            <div
              className="auth-icon"
              onClick={() => setIsAuthShown((prevState) => !prevState)}>
              <AiOutlineLogin />
              {isAuthShown && (
                <div className="authentication">
                  <span className="link">
                    <Link to="register">Register</Link>
                  </span>
                  <span className="link">
                    <Link to="login">Login</Link>
                  </span>
                </div>
              )}
            </div>

            <div className="authentication desktop">
              <span className="link">
                <Link to="register">Register</Link>
              </span>
              <span className="link">
                <Link to="login">Login</Link>
              </span>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            {isAuth && user && (
              <Fragment>
                <div
                  className="link user"
                  onClick={() => setIsUserLinkShown((prevState) => !prevState)}>
                  <img
                    src={`${BASE_API_IMAGE_url}/${user.avatar}`}
                    alt={user.name}
                  />
                  <span className="username">{user.name}</span>
                  {isUserLinkShown && (
                    <div className="user-link__container">
                      <span className="link">
                        <Link to="/edit-avatar">Edit avatar</Link>
                      </span>
                      <span className="link" onClick={logoutHandler}>
                        Logout
                      </span>
                    </div>
                  )}
                </div>
              </Fragment>
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
    display: flex;
    padding: 0.2rem;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    img {
      height: 100%;
      object-fit: cover;
    }
  }
  .linkContainer {
    display: flex;
    .mobile-nav {
      display: none;
      padding: 0 1rem;
      cursor: pointer;
      .clicked {
        .top-line {
          transform: translate(-50%, -50%) rotate(-45deg) !important;
        }

        .bottom-line {
          transform: translate(-50%, -50%) rotate(45deg) !important;
        }
      }
      .hamburger {
        padding: 1.5rem 1rem;
        position: relative;

        .line {
          transition: 0.2s;
          width: 1rem;
          height: 0.1rem;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, calc(-50% - 0.3rem));
          background-color: #fff;
        }
        .bottom-line {
          transform: translate(-50%, calc(-50% + 0.3rem));
        }
      }
    }
    .desktop-nav {
      display: flex;
      gap: 1.5rem;
    }
    .link,
    a {
      width: 100%;
      display: flex;
      justify-content: center;
      white-space: nowrap;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #e5e5e5;
      transition: color 0.15s ease-in-out;
      padding: 0.2rem 0.2rem;
      &:hover {
        color: #fff;
      }
    }
    .user {
      display: flex;
      align-items: center;
      /* gap: 0.5rem; */
      position: relative;
      padding: 0;
      img {
        padding: 0.5rem 0.5rem;
        height: var(--nav-height);
        width: var(--nav-height);
        object-fit: cover;
        border-radius: 50%;
      }

      .user-link__container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;
        /* gap: 0.5rem; */
        padding: 0.7rem 1rem;
        position: absolute;
        right: 0;
        top: 100%;
        background-color: var(--light-purple);
      }
    }
  }
  .RightSide {
    justify-content: flex-end;
    .auth-icon {
      display: none;
      width: 100%;
    }
    .authentication {
      display: flex;
      justify-content: space-between;
      align-items: center;
      /* gap: 1rem; */
    }
  }

  @media (max-width: 1000px) {
    padding: 0 2rem;
  }
  @media (max-width: 768px) {
    padding: 0;
    .desktop {
      display: none !important;
    }
    .logo-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .linkContainer {
      justify-content: space-between;
      height: 100%;
      .desktop-nav {
        display: none;
      }
      .mobile-nav {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        height: 100%;
        .menu-container {
          display: flex;
          position: absolute;
          flex-direction: column;
          top: 100%;
          left: 0.5rem;
          padding: 0.7rem 1rem;
          background-color: var(--light-purple);
          white-space: nowrap;
        }
      }
      .user {
        display: block;
        width: 100%;
        img {
          margin-right: 1rem;
        }
        .username {
          display: none;
        }
        .user-link__container {
          width: 150%;
          /* gap: 0.5rem; */
          right: 0.5rem;
        }
      }
    }
    .RightSide {
      .auth-icon {
        display: flex;
        align-items: center;
        font-size: 1.3rem;
        color: #fff;
        padding: 0 1rem;
        cursor: pointer;
      }
      .authentication {
        position: absolute;
        top: 100%;
        right: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.7rem 1rem;
        background-color: var(--light-purple);
        font-size: 1rem;
      }
    }
  }
`;
