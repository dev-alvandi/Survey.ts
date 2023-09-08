import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { TbMessageCircle2 } from 'react-icons/tb';
import 'react-toastify/dist/ReactToastify.css';

import { BASE_API_URL } from '../utils/api';
import { PostSchemaTypes } from '../store/postSlice';
import { useNavigate } from 'react-router-dom';

interface PropTypes {
  post: PostSchemaTypes;
  focusingOnInputHandler: () => void;
}

const PostActions: FC<PropTypes> = ({ post, focusingOnInputHandler }) => {
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [numberOfLikes, setNumberOfLikes] = useState(post.likes.length);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId && post.likes.includes(userId)) {
      setIsLiked(true);
    }
  }, [post.likes]);

  const likeHandler = () => {
    const userId = localStorage.getItem('userId');
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    axios
      .put(
        `${BASE_API_URL}/feed/like-post?postId=${post._id}`,
        {
          userId: userId,
          isLiked: !isLiked,
        },
        config
      )
      .then((res) => {
        if (res.status === 201) {
          setNumberOfLikes(res.data.likes);
          setIsLiked((prevState) => !prevState);
        }
      })
      .catch(({ response }) => {
        if (response.status === 401) {
          navigate('/login');
        }
      });
  };

  return (
    <Container>
      <div className="post-icons-container">
        {!isLiked && <AiOutlineHeart className="icon" onClick={likeHandler} />}
        {isLiked && (
          <AiFillHeart fill="#6643b5" className="icon" onClick={likeHandler} />
        )}

        <TbMessageCircle2
          className="icon comment-icon"
          onClick={focusingOnInputHandler}
        />
      </div>
      <div className="likes-container">
        <span className="likes">{numberOfLikes}</span>
        likes
      </div>
    </Container>
  );
};

export default PostActions;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  .post-icons-container {
    .icon {
      height: 23px;
      width: 23px;
      margin-right: 1rem;
      cursor: pointer;
    }
    .comment-icon {
      transform: rotateY(180deg);
    }
  }
  .likes-container {
    font-family: sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    display: flex;
    gap: 0.2rem;
  }
`;
