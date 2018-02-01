import React from 'react';
import Link from 'gatsby-link';
import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  text-decoration: none;
  width: 50%;
`;

const NavLink = styled(Link)`
  text-decoration: none;
`;

export default () => (
  <Nav>
    <NavLink to="/articles/" href="/articles/">
      Articles
    </NavLink>
    <NavLink to="/projects/" href="/projects/">
      Projects
    </NavLink>
    <NavLink to="/about/" href="/about/">
      About
    </NavLink>
  </Nav>
);
