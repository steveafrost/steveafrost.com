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
        I'm a <strong>web developer</strong> who lives in Brooklyn and codes in Javascript, Ruby, and PHP.
        <br /><br />
        When I'm not programming, I'm either biking, running, or at the community garden.
        <br /><br />
        Find me on <a href="https://steveafrost.com" target="_blank">GitHub</a>, <a href="https://linkedin.com/in/steveafrost.com" target="_blank">LinkedIn</a>, or <a href="https://twitter.com/SteveEff" target="_blank">Twitter</a>!
      </p>
    )
  }
}

export default Bio
