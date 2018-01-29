import React from 'react';
import Link from 'gatsby-link';
import styled from 'styled-components';
import Nav from './Nav';

const Header = styled.header`
  display: flex;
  background: papayawhip;
  justify-content: space-between;
  padding: 20px;
`;

const SiteTitle = styled.div`
  width: 50%;
`;

export default () => (
  <Header>
    <SiteTitle>
      <Link to="/" href="/">
        Steve Frost | Front-End Engineer
      </Link>
    </SiteTitle>
    <Nav />
  </Header>
);
