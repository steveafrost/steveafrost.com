import React from "react"
import Link from "gatsby-link"
import { rhythm } from "../utils/typography"

class Nav extends React.Component {
  render() {
    return (
      <nav>
        <Link to={"/"}>Steve Frost | Front-End Engineer</Link>
        <Link to={"/articles"}>Articles</Link>
        <Link to={"/projects"}>Projects</Link>
        <Link to={"/about"}>About</Link>
      </nav>
    )
  }
}

export default Nav
