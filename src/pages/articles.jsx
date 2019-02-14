import React from 'react';
import { graphql } from 'gatsby';
import Link from 'gatsby-link';
import get from 'lodash/get';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import Layout from '../components/Layout';

const ArticleList = styled.ul`
  list-style: katakana;
`;

const ArticleItem = styled.li`
  width: fit-content
`;

const ArticleLink = styled(Link)`
  background-image: none;
  color: rgba(0, 0, 0, 0.7);
  text-decoration: none;
  text-shadow: none;
  width: fit-content;

  &:after {
    content: '';
    width: 0px;
    height: 1px;
    display: block;
    background: rgba(0, 0, 0, 0.7);
    transition: 300ms;
  }

  &:hover:after {
    width: 100%;
  }
`;

export default ({ data }) => {
  const siteTitle = get(data, 'site.siteMetadata.title', null);
  const articles = get(data, 'allMarkdownRemark.edges', null);

  return (
    <Layout>
      <Helmet title={siteTitle} />
      <ArticleList>
        {articles.map(({ node }) => (
          <ArticleItem key={node.frontmatter.path}>
            <ArticleLink to={node.frontmatter.path}>{node.frontmatter.title}</ArticleLink>
          </ArticleItem>
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
