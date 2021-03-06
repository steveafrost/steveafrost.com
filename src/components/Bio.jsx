import React from 'react';
import styled from 'styled-components';
import profilePic from '../img/profile-pic.jpg';
import { rhythm } from '../utils/typography';

const Bio = styled.div`
  margin: 2rem;
`;

const BioText = styled.p`
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
    <BioText>
      <p>
        Written by
        {' '}
        <strong>Steve Frost</strong>
        {' '}
who lives in Minneapolis using technology to make an
        impact in the community and our environment.
      </p>
      <a href="https://twitter.com/SteveEff">Follow on Twitter</a>
    </BioText>
  </Bio>
);
