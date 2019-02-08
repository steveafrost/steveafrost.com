import React from 'react';
import styled from 'styled-components';
import AniLink from 'gatsby-plugin-transition-link/AniLink';
import Nav from './Nav';

const Header = styled.header`
  color: #3c6e71;
  display: flex;
  flex-flow: row wrap;
  font-family: 'Raleway', 'sans-serif';
  font-weight: bold;
  justify-content: space-between;
  margin-bottom: 50px;
  padding: 2rem;
  text-decoration: none;
  width: 100%;
`;

const SiteTitle = styled(AniLink)`
  font-size: 1.31em;
  width: 50%;
  text-decoration: none;
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
