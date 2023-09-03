import { ChangeEvent, forwardRef } from 'react';
import styled from 'styled-components';

interface TextareaProps {
  label?: string;
  placeholder?: string;
  id: string;
  rows?: number;
  value: string;
  className?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, onChange, value, rows, placeholder, className }, ref) => {
    return (
      <Container className={className}>
        <label htmlFor={id}>{label}</label>
        <div className={`input-container`}>
          <textarea
            id={id}
            cols={30}
            rows={rows || 10}
            onChange={onChange}
            value={value}
            placeholder={placeholder || 'Write what you want to share ...'}
            ref={ref}
          />
        </div>
      </Container>
    );
  }
);

export default Textarea;

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
      outline: none;
      border-radius: 0.25rem;
      appearance: none;
      background-color: #fff;
      border: 1px solid #6b7280;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5rem;
      resize: vertical;
      font-family: sans-serif;

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
