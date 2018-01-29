import React from 'react';
import Link from 'gatsby-link';
import styled from 'styled-components';

const Nav = styled.nav`
  color: #3c6e71;
  display: flex;
  justify-content: space-around;
  width: 50%;
`;

export default () => (
  <Nav>
    <Link to="/articles" href="/articles">
      Articles
    </Link>
    <Link to="/projects" href="/projects">
      Projects
    </Link>
    <Link to="/about" href="/about">
      About
    </Link>
  </Nav>
);
