import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-responsive-grid';
import Navigation from '../components/Navigation.jsx';
import { rhythm, scale } from '../utils/typography';

const Template = ({ children }) => (
  <div>
    <Navigation />
    <Container
      style={{
        maxWidth: rhythm(28),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      {children()}
    </Container>
  </div>
);

Template.propTypes = {
  children: PropTypes.func.isRequired,
};

export default Template;
