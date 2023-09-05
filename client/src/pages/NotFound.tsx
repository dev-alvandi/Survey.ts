import React, { Fragment } from 'react';
import styled from 'styled-components';
import Oops from '../assets/oops.jpg';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <Fragment>
      <Container>
        <div className="text-container">
          <h1 style={{ backgroundImage: `url(${Oops})` }}>Oops!</h1>
          <h3>404 - Page not Found</h3>
          <p>
            The page you are looking for might have been removed, <br /> had its
            name changed, or is temporarily unavailable.
          </p>
          <Button isLoading={false}>
            <Link to="/">go to homepage</Link>
          </Button>
        </div>
      </Container>
    </Fragment>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 1rem;

  .text-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    h1 {
      font-size: 15rem;
      background-size: cover;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      margin: 0;
    }
    h3 {
      font-size: 1.5rem;
      text-transform: uppercase;
      word-spacing: 0.1rem;
      text-align: center;
    }
    p {
      text-align: center;
    }
    button {
      background-color: var(--primary-purple);
      text-transform: uppercase;
      a {
        color: white;
      }
    }
  }

  @media (max-width: 768px) {
    .text-container {
      h1 {
        font-size: 10rem;
      }
    }
  }
  @media (max-width: 440px) {
    .text-container {
      h1 {
        font-size: 5rem;
      }
    }
  }
`;
