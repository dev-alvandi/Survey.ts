import { FC, Fragment, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import axios from 'axios';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UserSchemaTypes } from '../store/userSlice';
import { BASE_API_IMAGE_url, BASE_API_URL } from '../utils/api';
import dateFormatter from '../utils/dateFormatter';
import numberOfLikesText from '../utils/numberOfLikesText';
import OverlayModal from '../components/OverlayModal';
import { isEditingHandler } from '../store/commentSlice';
import { useAppDispatch } from '../store/store';
import { isEdited } from '../utils/isEdited';
import toastOptions from '../utils/toastOptions';

interface PostCommentPropType {
  comment: {
    _id: string;
    text: string;
    creator: UserSchemaTypes;
    relatedPost: string;
    likes: string[];
    created_at: Date;
    updated_at: Date;
  };
}

const PostComment: FC<PostCommentPropType> = ({ comment }) => {
  const dispatch = useAppDispatch();

  const [isYourComment, setIsYourComment] = useState(false);
  const [isDisplaySetting, setIsDisplayShowSetting] = useState(false);
  const [numberOfLikes, setNumberOfLikes] = useState(comment.likes.length);

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (comment.creator._id === userId) {
      setIsYourComment(true);
    }
    if (userId && comment.likes.includes(userId)) {
      setIsLiked(true);
    }
  }, [comment.creator._id, comment.likes, comment.likes.length]);

  const likeHandler = () => {
    const userId = localStorage.getItem('userId');
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    axios
      .put(
        `${BASE_API_URL}/feed/like-comment?commentId=${comment._id}`,
        {
          userId: userId,
          isLiked: !isLiked,
        },
        config
      )
      .then((data) => {
        if (data.status === 201) {
          toast.success(data.data.msg, toastOptions);
          setIsLiked((prevState) => !prevState);
          setNumberOfLikes(data.data.likes);
        }
      })
      .catch(({ response }) => {
        const errStatusArray = [401, 422, 500];
        if (errStatusArray.includes(response.status)) {
          toast.error(response.data.msg, toastOptions);
        }
      });
  };

  const editHandler = () => {
    // dispatch(editComment({ isEditing: true, comment: comment }));
    dispatch(
      isEditingHandler({
        status: true,
        commentId: comment._id,
        text: comment.text,
      })
    );
  };

  const deleteHandler = () => {
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    axios
      .delete(`${BASE_API_URL}/feed/delete-comment/${comment._id}`, config)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          toast.success(res.data.msg, toastOptions);
        }
      })
      .catch((err) => {
        console.log(err);
        // if (response.status === 401) {
        //   navigate('/login');
        // }
      });
  };

  const handleModalDisplay = () => {
    setIsDisplayShowSetting((prevState) => !prevState);
  };

  return (
    <Fragment>
      {isDisplaySetting && (
        <Fragment>
          {ReactDOM.createPortal(
            <OverlayModal
              editHandler={editHandler}
              deleteHandler={deleteHandler}
              isShown={isDisplaySetting}
              handleModalDisplay={handleModalDisplay}
            />,
            document.getElementById('overlay-root')!
          )}
        </Fragment>
      )}
      <Container>
        <img
          src={`${BASE_API_IMAGE_url}/${comment.creator.avatar}`}
          alt={comment.creator.name}
          className="img-avtar"
        />
        <div className="comment-details">
          <div className="comment-text__container">
            <div className="comment-creator-text__container">
              <div className="creator-info">
                <span className="creator-name">{comment.creator.name}</span>
                &nbsp;
                <span className="comment-text">{comment.text}</span>
              </div>
            </div>
            <div className="comment-details-info">
              <div className="date">{dateFormatter(comment.created_at)}</div>
              <div className="likes">{numberOfLikesText(numberOfLikes)}</div>
              {isEdited(comment) && <div className="edited">Edited</div>}
              {isYourComment && (
                <div className="post-edit-delete" onClick={handleModalDisplay}>
                  <div className="setting-dots" />
                </div>
              )}
            </div>
          </div>
          <div className="comment-action__container">
            {!isLiked && (
              <AiOutlineHeart className="icon" onClick={likeHandler} />
            )}
            {isLiked && (
              <AiFillHeart
                fill="#6643b5"
                className="icon"
                onClick={likeHandler}
              />
            )}
          </div>
        </div>
      </Container>
      <ToastContainer />
    </Fragment>
  );
};

export default PostComment;

const Container = styled.div`
  width: 100%;
  padding: 1rem 0;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  .img-avtar {
    height: 2.5rem;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    object-fit: cover;
  }
  .comment-details {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .comment-text__container {
      width: 13rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.5rem;
      .comment-creator-text__container {
        .creator-info {
          width: 100%;
          word-wrap: break-word;
          .creator-name {
            font-size: 1rem;
            font-style: normal;
            font-weight: 700;
          }
        }
      }
      .comment-details-info {
        font-size: 0.9rem;
        color: var(--secondary-text-color);
        display: flex;
        align-items: center;
        gap: 1rem;

        .date {
        }
        .likes {
        }
        .edited {
          font-style: italic;
        }
        .post-edit-delete {
          opacity: 0;
          visibility: hidden;
          padding: 0.6rem;
          position: relative;
          --dot-size: 0.2rem;
          .setting-dots {
            width: var(--dot-size);
            height: var(--dot-size);
            background-color: var(--secondary-text-color);
            border-radius: 50%;
            &:hover {
            }
            &::after,
            &::before {
              content: '';
              width: var(--dot-size);
              height: var(--dot-size);
              border-radius: 50%;
              background-color: var(--secondary-text-color);
              position: absolute;
              left: 25%;
              transform: translateX(-50%);
            }
            &::after {
              left: 75%;
            }
          }
        }
      }
    }
    .comment-action__container {
      .icon {
        height: 23px;
        width: 23px;
        margin-right: 1rem;
        cursor: pointer;
      }
    }
  }

  &:hover .comment-details .comment-details-info .post-edit-delete {
    opacity: 1;
    visibility: visible;
    cursor: pointer;
  }
`;
