import React from "react"
import Link from "gatsby-link"
import { rhythm } from "../utils/typography"

class Nav extends React.Component {
  render() {
    return (
      <nav>
        <div className="nav-left">
          <Link
            style={{
              boxShadow: "none",
              textDecoration: "none",
              float: "left",
            }}
            to={"/"}
          >
            Steve Frost | Front-End Engineer
          </Link>
        </div>
        <div className="nav-right">
          <Link
            style={{
              boxShadow: "none",
              textDecoration: "none",
            }}
            to={"/articles"}
          >
            Articles
          </Link>
          <Link
            style={{
              boxShadow: "none",
              textDecoration: "none",
            }}
            to={"/projects"}
          >
            Projects
          </Link>
          <Link
            style={{
              boxShadow: "none",
              textDecoration: "none",
            }}
            to={"/about"}
          >
            About
          </Link>
        </div>
      </nav>
    )
  }
}

export default Nav
