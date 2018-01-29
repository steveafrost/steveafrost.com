import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';

const Main = styled.main`
  max-width: 1000px;
  width: 100%;
`;

const Template = ({ children }) => (
  <div>
    <Header />
    <Main>{children()}</Main>
  </div>
);

export default Template;
