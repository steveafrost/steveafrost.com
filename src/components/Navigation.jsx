import React from 'react';
import Link from 'gatsby-link';
import { rhythm } from '../utils/typography';

const Navigation = () => (
  <nav>
    <Link to="/" href="/">
      Steve Frost | Front-End Engineer
    </Link>
    <Link to="/articles" href="/articles">
      Articles
    </Link>
    <Link to="/projects" href="/projects">
      Projects
    </Link>
    <Link to="/about" href="/about">
      About
    </Link>
  </nav>
);

export default Navigation;
