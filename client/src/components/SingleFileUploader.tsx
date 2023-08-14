import { memo } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';
import styled from 'styled-components';

const SingleFileUploader = ({
  onChangeUploadHandler,
  onDropUploadHandler,
}: any) => {
  return (
    <Container>
      <div className="dropzone">
        <input
          type="file"
          id="upload-input"
          onDrop={onDropUploadHandler}
          onChange={onChangeUploadHandler}
          // multiple
        />
        <div className="dashed-border">
          <div className="innerDropzone">
            <div className="dropzone-icon">
              <AiOutlineUpload />
            </div>
            <div className="dropzone-text">
              <h1>Choose a file&nbsp;</h1>
              <span>or drag it here.</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default memo(SingleFileUploader);

const Container = styled.div`
  .dropzone {
    width: 100%;
    margin-top: 1rem;
    background-color: #dcb5ff;
    padding: 0.5rem;
    height: 20rem;
    position: relative;
    border-radius: 0.375rem;
    transition: background-color 0.3s;

    #upload-input {
      width: 100%;
      height: 100%;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      border: 1px solid #000;
    }
    .dashed-border {
      height: 100%;
      border: 2px dashed #000;
      display: flex;
      justify-content: center;
      align-items: center;
      .innerDropzone {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .dropzone-icon {
          svg {
            font-size: 3.5rem;
          }
        }
        .dropzone-text {
          display: flex;
          align-items: center;
          font-family: sans-serif;
          h1 {
            font-size: 1.5rem;
          }
          span {
            font-size: 1.5rem;
          }
        }
      }
    }
    &:hover {
      background-color: #dcb5ff90;
    }
  }
`;
