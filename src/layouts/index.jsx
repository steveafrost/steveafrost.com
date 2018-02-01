import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';

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

const Template = ({ children }) => (
  <Container>
    <Header />
    <Main>{children()}</Main>
  </Container>
);

export default Template;
