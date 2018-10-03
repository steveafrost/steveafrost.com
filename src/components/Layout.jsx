import React from 'react';
import styled from 'styled-components';
import Header from './Header';

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: 20px auto;
  width: 100%;
`;

const Main = styled.main`
  max-width: 800px;
  width: 100%;
`;

export default ({ children }) => (
  <Container>
    <Header />
    <Main>{children}</Main>
  </Container>
);
