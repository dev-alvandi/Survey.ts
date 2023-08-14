import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '../store/store';
import styled from 'styled-components';
import { BASE_API_URL } from '../utils/api';
import Loader from '../components/Loader';
import PreviewPosts from '../components/PreviewPosts';

// interface UserType {
//   name?: string;
//   email?: string;
//   password?: string;
//   resetToken?: string;
//   resetTokenExpiration?: Date;
//   posts?: {}[];
//   likedPosts?: {}[];
// }

interface PostTypes {
  _id: string;
  title: string;
  caption: string;
  imageUrl: string;
}

export default function Home() {
  const [posts, setPosts] = useState<PostTypes[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BASE_API_URL}/feed/receive-posts`)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          return setPosts([...res.data.posts]);
        }
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container className="pageContainer">
      <Loader isLoading={isLoading} />
      {posts.map((post) => (
        <PreviewPosts key={post._id} post={post} />
      ))}
    </Container>
  );
}

const Container = styled.div`
  .welcome {
    width: 100%;
    padding: 1rem 0;
    border-radius: 0.375rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--success-green);
  }
`;
