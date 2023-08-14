import React, { FC } from 'react';
import styled from 'styled-components';

interface LoaderPropTypes {
  isLoading: boolean;
}

const Loader: FC<LoaderPropTypes> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <Container>
        <div className="spinner"></div>
      </Container>
    );
  }
  return null;
};

export default Loader;

const Container = styled.div`
  margin: 2rem;
  .spinner {
    width: 4em;
    height: 4em;
    border: 0.5rem solid rgba(255, 255, 255, 0.1);
    border-left-color: var(--loader-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
