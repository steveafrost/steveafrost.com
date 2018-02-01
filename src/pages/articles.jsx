import React, { Component } from 'react';
import Link from 'gatsby-link';
import get from 'lodash/get';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { rhythm } from '../utils/typography';

const ArticleList = styled.ul`
  font-family: 'Raleway', 'sans-serif';
  font-weight: normal;
  font-size: 20px;
  list-style: none;
`;

const ArticleLink = styled(Link)`
  text-decoration: none;
`;

class ArticleIndex extends Component {
  render() {
    const pageLinks = [];
    const siteTitle = get(this, 'props.data.site.siteMetadata.title');
    const posts = get(this, 'props.data.allMarkdownRemark.edges');
    posts.forEach((post) => {
      if (post.node.path !== '/404/') {
        const title = get(post, 'node.frontmatter.title') || post.node.path;
        pageLinks.push(<li key={post.node.frontmatter.path}>
          <ArticleLink to={post.node.frontmatter.path}>{post.node.frontmatter.title}</ArticleLink>
                       </li>);
      }
    });

    return (
      <div>
        <Helmet title={get(this, 'props.data.site.siteMetadata.title')} />
        <ArticleList>{pageLinks}</ArticleList>
      </div>
    );
  }
}

export default ArticleIndex;

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
