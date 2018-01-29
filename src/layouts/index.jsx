import React from 'react';
import Link from 'gatsby-link';
import Navigation from '../components/Navigation';
import { rhythm, scale } from '../utils/typography';
import customCSS from '../css/custom.css';

const Template = ({ children }) => (
  <div>
    <Navigation />
    {children()}
  </div>
);

export default Template;
