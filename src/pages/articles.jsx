import React from 'react';
import { graphql } from 'gatsby';
import Link from 'gatsby-link';
import get from 'lodash/get';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import Layout from '../components/Layout';

const ArticleList = styled.ul`
  font-family: 'Raleway', 'sans-serif';
  font-weight: normal;
  font-size: 20px;
  list-style: none;
`;

const ArticleLink = styled(Link)`
  text-decoration: none;
`;

export default ({ data }) => {
  const siteTitle = get(data, 'site.siteMetadata.title', null);
  const articles = get(data, 'allMarkdownRemark.edges', null);

  return (
    <Layout>
      <Helmet title={siteTitle} />
      <ArticleList>
        {articles.map(({ node }) => (
          <li key={node.frontmatter.path}>
            <ArticleLink to={node.frontmatter.path}>{node.frontmatter.title}</ArticleLink>
          </li>
        ))}
      </ArticleList>
    </Layout>
  );
};

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
            title
          }
        }
      }
    }
  }
`;
