import React from "react"
import Link from "gatsby-link"
import { Container } from "react-responsive-grid"
import Nav from "../components/Nav.js"

import { rhythm, scale } from "../utils/typography"
import customCSS from "../css/custom.css"

class Template extends React.Component {
  render() {
    const { location, children } = this.props
    let header = (<Nav />)

    return (
      <Container
        style={{
          maxWidth: rhythm(28),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {header}
        {children()}
      </Container>
    )
  }
}

Template.propTypes = {
  children: React.PropTypes.function,
  location: React.PropTypes.object,
  route: React.PropTypes.object,
}

export default Template
