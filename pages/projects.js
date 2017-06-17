import React from 'react'
import { Link } from 'react-router'
import { prefixLink } from 'gatsby-helpers'
import { rhythm } from 'utils/typography'
import Helmet from "react-helmet"
import { config } from 'config'
import include from 'underscore.string/include'
import projectList from '../projectList.js'
import ProjectCard from '../components/ProjectCard'

class ProjectIndex extends React.Component {
  render () {
    return (
      <div>
        <Helmet
          title="Projects | Steve Frost - Full Stack Web Developer"
          meta={[
            {"name": "description", "content": "Full-Stack Web Developer. Urban Fixed Cyclist. Hugger of Trees."},
            {"name": "keywords", "content": "blog, articles"},
          ]}
        />

        <div className="project-index">
          {projectList.map(p => <ProjectCard
            key={p.title}
            title={p.title}
            description={p.description}
            projectLink={p.projectLink}
            pageLink={p.pageLink}
            gitLink={p.gitLink}
            icon={p.icon}
            />)
          }
        </div>
      </div>
    )
  }
}

ProjectIndex.propTypes = {
  route: React.PropTypes.object,
}

export default ProjectIndex
