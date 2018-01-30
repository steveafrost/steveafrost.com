import React from 'react';
import Link from 'gatsby-link';
import styled from 'styled-components';
import Nav from './Nav';

const Header = styled.header`
  color: #3c6e71;
  display: flex;
  flex-flow: row wrap;
  font-family: 'Raleway', 'sans-serif';
  font-weight: 700;
  justify-content: space-between;
  padding: 20px 0;
  text-decoration: none;
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
