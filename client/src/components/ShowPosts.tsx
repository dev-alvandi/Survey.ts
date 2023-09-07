import { FC, Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { BASE_API_URL } from '../utils/api';
import PreviewPosts from './PreviewPosts';
import { PostSchemaTypes } from '../store/postSlice';
import LoadingPreviwPosts from './LoadingPreviwPosts';
// import Loader from './Loader';

interface ShowPostsPropTypes {
  typeOfPosts: 'MyPosts' | 'AllPosts';
}

const ShowPosts: FC<ShowPostsPropTypes> = ({ typeOfPosts }) => {
  const [posts, setPosts] = useState<PostSchemaTypes[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [endOfPosts, setEndOfPosts] = useState(false);
  const [isPostFound, setIsPostFound] = useState(true);

  useEffect(() => {
    if (!endOfPosts) {
      const scrollListener = (e: Event) => {
        // const paddingBottom = 48;
        const target = e.target;
        if (!(target instanceof Document)) {
          return;
        }
        const scrollHeight = target.documentElement.scrollHeight;
        const currentHeight =
          target.documentElement.scrollTop + window.innerHeight;

        if (
          Math.floor(scrollHeight - currentHeight) === 0 &&
          posts.length > 0
        ) {
          // setIsLoading(true);
          setPage(page + 1);
        }
      };
      window.addEventListener('scroll', scrollListener);

      return () => window.removeEventListener('scroll', scrollListener);
    }
  }, [endOfPosts, page, posts, posts.length]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    // const controller = new AbortController();
    // const signal = controller.signal;
    const config = {
      // signal: signal,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    let fetchingUrl: string = '';
    if (typeOfPosts === 'AllPosts') {
      fetchingUrl = `${BASE_API_URL}/feed/receive-posts/?page=${page}`;
    } else if (typeOfPosts === 'MyPosts') {
      fetchingUrl = `${BASE_API_URL}/feed/receive-myPosts/?page=${page}&userId=${userId}`;
    }

    // console.log(page);

    axios
      .get(fetchingUrl, config)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          if (res.data.posts.length === 0) {
            setEndOfPosts(true);
            return setIsPostFound(false);
          }
          // setIsLoading(false);
          setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
          setIsPostFound(true);
        }
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
        if (err.code !== 'ERR_CANCELED') {
          // setIsLoading(false);
        }
      });
    // return () => {
    //   controller.abort();
    // };
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
      {posts.length === 0 && isPostFound ? (
        <Fragment>
          <LoadingPreviwPosts />
        </Fragment>
      ) : (
        ''
      )}

      {!isPostFound ? <div>You have no post yet!</div> : ''}
      {/* {!endOfPosts && <Loader isLoading={isLoading} />} */}
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
