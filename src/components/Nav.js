import React from "react"

import "typeface-montserrat"
import "typeface-merriweather"

import { rhythm } from "../utils/typography"

class Nav extends React.Component {
  render() {
    return (
      <nav
        style={{
          marginBottom: rhythm(2.5),
          width: rhtym(40)
        }}
      >
        <li>Home</li>
        <li>Articles</li>
        <li>Projects</li>
        <li>About</li>
      </nav>
    )
  }
}

export default Nav
