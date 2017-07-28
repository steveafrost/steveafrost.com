import React from "react"

// Import typefaces
import "typeface-montserrat"
import "typeface-merriweather"

import profilePic from "./profile-pic.jpg"
import { rhythm } from "../utils/typography"

class Bio extends React.Component {
  render() {
    return (
      <p
        style={{
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={`Kyle Mathews`}
          style={{
            float: "left",
            marginRight: rhythm(1 / 4),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
        Written by
        {" "}
        <strong>Steve Frost</strong>
        {" "}
        who is newly Minnesotan and focused on making a difference in the community and our environment through full-stack web development.
        {" "}
        <a href="https://twitter.com/steveafrost">
          Follow on Twitter
        </a>
      </p>
    )
  }
}

export default Bio
