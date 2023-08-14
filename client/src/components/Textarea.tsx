import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';

interface TextareaProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea: FC<TextareaProps> = ({ label, id, onChange, value }) => {
  return (
    <Container>
      <label htmlFor={id}>{label}</label>
      <div className="input-container">
        <textarea
          id={id}
          cols={30}
          rows={10}
          onChange={onChange}
          value={value}
          placeholder="Write what you want to share ..."
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
  margin: 1rem 0;
  label {
    display: block;
    font-weight: 500;
  }
  .input-container {
    margin-top: 0.5rem;
    position: relative;

    textarea {
      width: 100%;
      border-radius: 0.25rem;
      appearance: none;
      background-color: #fff;
      border-color: #6b7280;
      border-width: 1px;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5rem;
      resize: vertical;

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        border: 1px solid var(--primary-blue);
      }
      &::placeholder {
        color: #6b7280;
        opacity: 1;
        font-family: sans-serif;
      }
    }
  }
`;

export default Textarea;
