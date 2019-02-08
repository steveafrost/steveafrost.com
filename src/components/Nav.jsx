import React from 'react';
import styled from 'styled-components';
import AniLink from 'gatsby-plugin-transition-link/AniLink';

const Nav = styled.nav`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  text-decoration: none;
  width: 40%;
`;

const NavLink = styled(AniLink)`
  font-size: 1.31em;
  text-decoration: none;
`;

export default () => (
  <Nav>
    <NavLink to="/articles" paintDrip hex="#F9C22E" style={{ color: '#F9C22E' }}>
      Articles
    </NavLink>
    <NavLink to="/projects" paintDrip hex="#F15946" style={{ color: '#F15946' }}>
      Projects
    </NavLink>
    <NavLink to="/about" paintDrip hex="#E01A4F" style={{ color: '#E01A4F' }}>
      About
    </NavLink>
  </Nav>
);
