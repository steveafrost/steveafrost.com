import React from 'react';
import styled from 'styled-components';
import breakpoint from 'styled-components-breakpoint';
import AniLink from 'gatsby-plugin-transition-link/AniLink';
import Nav from './Nav';

const Header = styled.header`
  color: #53B3CB;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  margin-bottom: 50px;
  text-decoration: none;
  width: 100%;

  ${breakpoint('tablet')`
    flex-flow: row;
  `}
`;

const SiteTitle = styled(AniLink)`
  align-self: center;
  background-image: none;
  font-size: 1.35rem;
  margin-bottom: 15px;
  text-decoration: none;
  text-shadow: none;

  ${breakpoint('tablet')`
    margin-bottom: 0;
  `}
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
