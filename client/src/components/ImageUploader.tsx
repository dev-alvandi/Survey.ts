import { FC, useEffect } from 'react';
import styled from 'styled-components';
import { GiCancel } from 'react-icons/gi';

interface SliderProp {
  image: {
    url: string;
    name: string;
  };
  removeUploadedImgHandler: (url: string) => void;
}

const ImageUploader: FC<SliderProp> = ({ image, removeUploadedImgHandler }) => {
  return (
    <Container className="img-container">
      <div className="slider">
        <div className="image" key={image.url}>
          <button
            className="delete-img"
            onClick={removeUploadedImgHandler.bind(null, image.url)}>
            <GiCancel />
          </button>
          <img
            className="uploaded-image"
            src={image.url}
            alt={image.name}
            onLoad={() => {
              URL.revokeObjectURL(image.url);
            }}
          />
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  margin: 1rem 0;
  .slider {
    display: flex;
    gap: 1rem;
    .image {
      width: 100%;
      max-width: 50%;
      margin: auto;
      display: inline-block;
      position: relative;
      .delete-img {
        aspect-ratio: 16 / 9;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 10px;
        top: 10px;
        padding: 0.5rem;
        border: none;
        outline: none;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        cursor: pointer;
        svg {
        }
      }
      .uploaded-image {
        width: 100%;

        object-fit: contain;
        border-radius: 0.375rem;
      }
    }
  }
`;

export default ImageUploader;
