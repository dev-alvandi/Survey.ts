import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
// import { useAppSelector } from '../store/store';
import styled from 'styled-components';

import { BASE_API_URL } from '../utils/api';
import Loader from '../components/Loader';
import PreviewPosts from '../components/PreviewPosts';
import { PostSchemaTypes } from '../store/postSlice';

export default function Home() {
  const [posts, setPosts] = useState<PostSchemaTypes[]>([]);
  const [page, setPage] = useState(1);
  const [endOfPosts, setEndOfPosts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
          setPage(page + 1);
        }
      };
      window.addEventListener('scroll', scrollListener);

      return () => window.removeEventListener('scroll', scrollListener);
    }
  }, [endOfPosts, page]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsLoading(true);
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    axios
      .get(`${BASE_API_URL}/feed/receive-posts?page=${page}`, config)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
          if (res.data.posts.length === 0) {
            setEndOfPosts(true);
          }
          return;
        }
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

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
      <Loader isLoading={isLoading} />
      {endOfPosts && (
        <div className="end">There is no more posts in the database!</div>
      )}
    </Container>
  );
}

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
