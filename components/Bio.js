import React from 'react'
import { config } from 'config'
import { rhythm } from 'utils/typography'
import profilePic from './profile-pic.jpg'

class Bio extends React.Component {
  render () {
    return (
      <p
        style={{
          marginBottom: rhythm(2.5),
        }}
      >
        I'm a <strong>software engineer</strong> who lives in Brooklyn and codes in Javascript, PHP, and Ruby.
        <br /><br />
        When I'm not programming, I'm either biking, running, at a concert, or at the community garden.
        <br /><br />
        Find me on <a href="https://steveafrost.com" target="_blank">GitHub</a>, <a href="https://linkedin.com/in/steveafrost.com" target="_blank">LinkedIn</a>, or <a href="https://twitter.com/SteveEff">Twitter</a>!
        <img
          src={profilePic}
          alt={`author ${config.authorName}`}
          style={{
            marginRight: rhythm(1/4),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
      </p>
    )
  }
}

export default Bio
