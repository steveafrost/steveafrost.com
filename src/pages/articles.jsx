import React, { Component } from 'react';
import Link from 'gatsby-link';
import get from 'lodash/get';
import Helmet from 'react-helmet';
import { rhythm } from '../utils/typography';

class BlogIndex extends Component {
  render() {
    const pageLinks = [];
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const posts = get(this, 'props.data.allMarkdownRemark.edges');
    posts.forEach((post) => {
      if (post.node.path !== '/404/') {
        const title = get(post, 'node.frontmatter.title') || post.node.path;
        pageLinks.push(<li
          key={post.node.frontmatter.path}
          style={{
              marginBottom: rhythm(1 / 4),
              marginTop: rhythm(1 / 4),
            }}
        >
          <Link style={{ boxShadow: 'none' }} to={post.node.frontmatter.path}>
            {post.node.frontmatter.title}
          </Link>
                       </li>);
      }
    });

    return (
      <div>
        <Helmet title={get(this, 'props.data.site.siteMetadata.title')} />
        <ul>{pageLinks}</ul>
      </div>
    );
  }
}

export default BlogIndex;

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            path
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
