import React, { FC, Fragment } from 'react';
import styled from 'styled-components';

interface PropTypes {
  deletePostHandler: () => void;
  editHandler: () => void;
  handleDisplayingSettings: () => void;
  isDisplaySetting: boolean;
  isYourPost: boolean;
  createdAt?: Date;
  creatorName: string;
  imageSrc: string;
}

const PostHeader: FC<PropTypes> = ({
  imageSrc,
  creatorName,
  createdAt,
  isYourPost,
  handleDisplayingSettings,
  isDisplaySetting,
  editHandler,
  deletePostHandler,
}) => {
  return (
    <Fragment>
      <Image src={imageSrc} alt={creatorName} className="img-avtar" />
      <CreatorDetails>
        <span className="creator bold">{creatorName}</span>
        <div className="creator-details__extra-info">
          <time dateTime={createdAt!.toString()} className="time">
            {new Date(createdAt!).toLocaleDateString('sv-SE', {
              month: 'short',
              day: 'numeric',
            })}
            &nbsp;-&nbsp;
            {new Date(createdAt!).toLocaleTimeString('sv-SE', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>
          {isYourPost && (
            <div className="post-settings" onClick={handleDisplayingSettings}>
              <div className="setting-dots" />
              {isDisplaySetting && (
                <div className="post-settings__items">
                  <div className="edit" onClick={editHandler}>
                    Edit
                  </div>
                  <div className="delete" onClick={deletePostHandler}>
                    Delete
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CreatorDetails>
    </Fragment>
  );
};

export default PostHeader;

const Image = styled.img`
  height: 100%;
  width: auto;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: cover;
`;

const CreatorDetails = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding-left: 0.5rem;
  .creator-details__extra-info {
    display: flex;
    gap: 0.7rem;
    .post-settings {
      padding: 0.9rem;
      position: relative;
      border-radius: 50%;
      /* border: 1px solid #000; */
      cursor: pointer;
      transition: 200ms background-color ease-in-out;
      .setting-dots {
        &:hover {
          background-color: #fff;
        }
        --dot-size: 0.2rem;
        --dot-color: ;
        width: var(--dot-size);
        height: var(--dot-size);
        border-radius: 50%;
        background-color: #000;
        &::after,
        &::before {
          content: '';
          width: var(--dot-size);
          height: var(--dot-size);
          border-radius: 50%;
          background-color: #000;
          position: absolute;
          top: 25%;
          transform: translateY(-50%);
        }
        &::after {
          /* top: 100%;
              transform: translateY(-100%); */
          top: 75%;
        }
      }
      .post-settings__items {
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #ffffff;
        .edit,
        .delete {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.5rem 1rem;
          transition: 200ms all ease-in-out;
          &:hover {
            background-color: var(--primary-purple);
            color: #fff;
          }
        }
      }
    }
  }
`;
