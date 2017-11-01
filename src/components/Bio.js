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
          alt={`Steve Frost`}
          style={{
            borderRadius: "0.5em",
            float: "left",
            marginRight: rhythm(1 / 3),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
        Written by
        {" "}
        <strong>Steve Frost</strong>
        {" "}
        who lives in Minneapolis using technology to make an impact in the community and our environment.
        {" "}
        <a href="https://twitter.com/SteveEff">
          Follow on Twitter
        </a>
      </p>
    )
  }
}

export default Bio
