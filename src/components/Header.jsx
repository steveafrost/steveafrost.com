import React from 'react';
import styled from 'styled-components';
import AniLink from 'gatsby-plugin-transition-link/AniLink';
import Nav from './Nav';

const Header = styled.header`
  color: #53B3CB;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin-bottom: 50px;
  text-decoration: none;
  width: 100%;
`;

const SiteTitle = styled(AniLink)`
  background-image: none;
  font-size: 1.25em;
  text-decoration: none;
  text-shadow: none;
  width: 50%;
`;

export default () => (
  <Header>
    <SiteTitle
      to="/"
      href="/"
      paintDrip
      hex="#53B3CB"
      style={{ color: '#53B3CB' }}
    >
      Steve Frost | Front-End Engineer
    </SiteTitle>
    <Nav />
  </Header>
);
