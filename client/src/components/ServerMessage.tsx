import React, { FC } from 'react';
import styled from 'styled-components';

interface PropTypes {
  messageArray: { text: string; type: 'error' | 'success' | 'info' }[];
}

const ServerMessage: FC<PropTypes> = ({ messageArray }) => {
  return (
    <Container>
      {messageArray.length >= 0 &&
        messageArray.map((message, index) => (
          <div
            key={index}
            className={`message-container ${message.type}-message`}>
            <span>{message.text}</span>
          </div>
        ))}
    </Container>
  );
};

const Container = styled.div`
  .message-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    background-color: var(--danger-red);
    color: #fff;
    margin-top: 0.5rem;
  }
  .error-message {
    background-color: var(--danger-red);
  }

  .success-message {
    background-color: var(--success-green);
  }

  .info-message {
    background-color: var(--info-blue);
  }
`;

export default ServerMessage;
