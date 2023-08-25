import styled from 'styled-components';

import ShowPosts from '../components/ShowPosts';

export default function Home() {
  return (
    <Container>
      <ShowPosts typeOfPosts={'AllPosts'} />
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  position: relative;
`;
