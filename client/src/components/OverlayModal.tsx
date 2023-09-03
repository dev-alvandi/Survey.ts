import { FC, useState } from 'react';
import styled from 'styled-components';
// import { editComment } from '../store/commentSlice';

interface OverlayModalPropType {
  deleteHandler: () => void;
  editHandler: () => void;
  isShown: boolean;
  handleModalDisplay: () => void;
}

const OverlayModal: FC<OverlayModalPropType> = ({
  deleteHandler,
  editHandler,
  isShown,
  handleModalDisplay,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <Container>
      <div
        className={`${isShown && isModalOpen ? 'show' : ''} modal-container`}>
        <div className="backdrop" onClick={handleModalDisplay}></div>
        <div className="modal">
          <button
            className="top-list"
            onClick={() => {
              editHandler();
              setIsModalOpen(false);
            }}>
            Edit
          </button>
          <button
            className="bottom-list"
            onClick={() => {
              deleteHandler();
              setIsModalOpen(false);
            }}>
            Delete
          </button>
        </div>
      </div>
    </Container>
  );
};

export default OverlayModal;

const Container = styled.div`
  .modal-container {
    display: none;
  }
  .show {
    display: block;
  }

  --modal-border-radius: 0.75rem;

  .backdrop {
    --backdrop-color: rgba(0, 0, 0, 0.65);
    position: fixed;
    background-color: var(--backdrop-color);
    z-index: 1200;
    width: 100vw;
    height: 100vh;
  }
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1201;
    border-radius: var(--modal-border-radius);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    transform-origin: center;
    animation: modalAppears 0.1s 1 ease-out;
    & > button {
      width: 100%;
      outline: none;
      border: none;
      padding: 1rem 10rem;
      background-color: transparent;
      cursor: pointer;
      border-top: 1px solid #dbdbdb;

      &:hover {
        background-color: var(--primary-purple);
        color: #fff;
      }
    }

    .top-list {
      border-top-left-radius: var(--modal-border-radius);
      border-top-right-radius: var(--modal-border-radius);
      border: none;
    }

    .bottom-list {
      border-bottom-left-radius: var(--modal-border-radius);
      border-bottom-right-radius: var(--modal-border-radius);
    }
  }

  @keyframes modalAppears {
    0% {
      opacity: 0;
      transform: scale(1.2) translate(-50%, -50%);
    }
    100% {
      opacity: 1;
      transform: scale(1) translate(-50%, -50%);
    }
  }
`;
