import { FC, Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { BASE_API_URL } from '../utils/api';
import PreviewPosts from './PreviewPosts';
import { PostSchemaTypes } from '../store/postSlice';
import LoadingPreviwPosts from './LoadingPreviwPosts';
import Loader from './Loader';

interface ShowPostsPropTypes {
  typeOfPosts: 'MyPosts' | 'AllPosts';
}

const ShowPosts: FC<ShowPostsPropTypes> = ({ typeOfPosts }) => {
  const [posts, setPosts] = useState<PostSchemaTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [endOfPosts, setEndOfPosts] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!endOfPosts) {
      const scrollListener = (e: Event) => {
        const paddingBottom = 48;
        const target = e.target;
        if (!(target instanceof Document)) {
          return;
        }
        const scrollHeight = target.documentElement.scrollHeight;
        const currentHeight =
          target.documentElement.scrollTop + window.innerHeight;
        if (Math.floor(scrollHeight - currentHeight) === 0) {
          setIsLoading(true);
          setPage(page + 1);
        }
      };
      window.addEventListener('scroll', scrollListener);

      return () => window.removeEventListener('scroll', scrollListener);
    }
  }, [endOfPosts, page]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      // timeout: 1, //! Correct this!!!!!!!
    };
    let fetchingUrl: string = '';
    if (typeOfPosts === 'AllPosts') {
      fetchingUrl = `${BASE_API_URL}/feed/receive-posts/?page=${page}`;
    } else if (typeOfPosts === 'MyPosts') {
      fetchingUrl = `${BASE_API_URL}/feed/receive-posts/?page=${page}&userId=${userId}`;
    }
    axios
      .get(fetchingUrl, config)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
          setIsLoading(false);
          if (res.data.posts.length === 0) {
            setEndOfPosts(true);
          }
          return;
        }
      })
      .then(() => {})
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, [page, typeOfPosts]);

  const handleDeletedItem = (postId: string) => {
    const filteredPosts = posts.filter((p) => p._id !== postId);
    setPosts(filteredPosts);
  };

  return (
    <Container className="pageContainer">
      {posts.map((post) => (
        <PreviewPosts
          key={post._id}
          post={post}
          handleDeletedItem={handleDeletedItem}
        />
      ))}
      {posts.length === 0 ? (
        <Fragment>
          <LoadingPreviwPosts />
          <LoadingPreviwPosts />
          <LoadingPreviwPosts />
          <LoadingPreviwPosts />
        </Fragment>
      ) : (
        ''
      )}
      {endOfPosts && <Loader isLoading={isLoading} />}
    </Container>
  );
};

export default ShowPosts;

const Container = styled.div`
  .end {
    width: 60%;
    padding: 1rem 0;
    border-radius: 0.375rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--yellow-color);
  }
`;
