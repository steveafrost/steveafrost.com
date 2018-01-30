import React from 'react';
import styled from 'styled-components';
import profilePic from './profile-pic.jpg';
import { rhythm } from '../utils/typography';

const Bio = styled.div`
  font-weight: 900;
  margin: 2rem;
`;

export default () => (
  <Bio>
    <img
      src={profilePic}
      alt="Steve Frost"
      style={{
        borderRadius: '0.5em',
        float: 'left',
        marginRight: rhythm(1),
        marginBottom: 0,
        width: rhythm(5),
        height: rhythm(5),
      }}
    />
    <h2>
      Written by <strong>Steve Frost</strong> who lives in Minneapolis using technology to make an
      impact in the community and our environment.{' '}
      <a href="https://twitter.com/SteveEff">Follow on Twitter</a>
    </h2>
  </Bio>
);
