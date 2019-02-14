import React from 'react';
import styled from 'styled-components';
import breakpoint from 'styled-components-breakpoint';
import AniLink from 'gatsby-plugin-transition-link/AniLink';

const Nav = styled.nav`
  display: flex;
  flex: 0 1 40%;
  justify-content: space-around;
  text-decoration: none;

  ${breakpoint('tablet')`
    justify-content: space-between;
  `}
`;

const NavLink = styled(AniLink)`
  background-image: none;
  font-size: 1.35rem;
  text-decoration: none;
  text-shadow: none;
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
