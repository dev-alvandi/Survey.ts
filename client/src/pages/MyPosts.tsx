import styled from 'styled-components';

import ShowPosts from '../components/ShowPosts';

export default function MyPosts() {
  return (
    <Container>
      <ShowPosts typeOfPosts={'MyPosts'} />
    </Container>
  );
}

const Container = styled.div``;
