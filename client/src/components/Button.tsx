import React, { FC, memo } from 'react';
import styled from 'styled-components';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset' | undefined;
  disabled?: boolean;
  onClick?: () => void;
  children: any;
  isLoading: boolean;
  className?: string;
}

const Button: FC<ButtonProps> = ({
  onClick,
  type,
  disabled,
  isLoading,
  children,
  className,
}) => {
  return (
    <ButtonElement
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
      className={`${isLoading && 'disabled'} ${className}`}>
      {!isLoading ? children : 'Loading...'}
    </ButtonElement>
  );
};

export default memo(Button);

const ButtonElement = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  border: 0;
  background-color: var(--primary-blue);
  color: #fff;
  font-weight: 600;
  outline: 2px solid;
  cursor: pointer;
  transition: background-color 200ms ease-in-out;
  &:hover {
    background-color: var(--primary-hover-blue);
  }
  .disabled {
    cursor: not-allowed;
  }
`;
