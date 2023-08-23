import { ChangeEvent, FC, useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import styled from 'styled-components';

interface InputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: string;
}

const Input: FC<InputProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  disabled,
}) => {
  const [typeInput, setTypeInput] = useState(type);

  return (
    <Container>
      <label htmlFor={id}>{label}</label>
      <div className="input-container">
        <input
          style={{
            paddingRight: `${type === 'password' ? '2.2rem' : '0.75rem'}`,
          }}
          type={typeInput}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onCopy={(e) => type === 'password' && e.preventDefault()}
        />
        {type === 'password' && typeInput === 'password' ? (
          <div className="svg-container" onClick={() => setTypeInput('text')}>
            <AiFillEyeInvisible />
          </div>
        ) : type === 'password' && typeInput === 'text' ? (
          <div
            className="svg-container"
            onClick={() => setTypeInput('password')}>
            <AiFillEye />
          </div>
        ) : (
          ''
        )}
      </div>
    </Container>
  );
};

export default Input;

const Container = styled.div`
  margin: 1rem 0;
  label {
    display: block;
    font-weight: 500;
  }
  .input-container {
    margin-top: 0.5rem;
    position: relative;
    .svg-container {
      position: absolute;
      margin-top: 2px;
      margin-bottom: 2px;
      margin-right: 2px;
      right: 0;
      top: 0;
      height: 90%;
      padding: 0 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      mix-blend-mode: normal;
      cursor: pointer;
      svg {
        font-size: 1.1rem;
      }
    }
    input {
      width: 100%;
      border-radius: 0.25rem;
      appearance: none;
      background-color: #fff;
      border-color: #6b7280;
      border-width: 1px;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5rem;

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        border: 1px solid var(--primary-blue);
      }
      &::placeholder {
        color: #6b7280;
        opacity: 1;
      }
    }
  }
`;
