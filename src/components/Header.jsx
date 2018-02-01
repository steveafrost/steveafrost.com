import React from 'react';
import Link from 'gatsby-link';
import styled from 'styled-components';
import Nav from './Nav';

const Header = styled.header`
  color: #3c6e71;
  display: flex;
  flex-flow: row wrap;
  font-family: 'Raleway', 'sans-serif';
  font-weight: bold;
  justify-content: space-between;
  margin-bottom: 50px;
  padding: 20px 0;
  text-decoration: none;
  width: 100%;
`;

const SiteTitle = styled(Link)`
  width: 50%;
  text-decoration: none;
`;

export default () => (
  <Header>
    <SiteTitle to="/" href="/">
      Steve Frost | Front-End Engineer
    </SiteTitle>
    <Nav />
  </Header>
);
