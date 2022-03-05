/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */
import { ReactElement, ReactNode } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { CssBaseline, Box } from '@material-ui/core';
import Header from './header';

interface LayoutProps {
  children: ReactNode;
}
function Layout({ children }: LayoutProps): ReactElement {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <Box bgcolor="background.paper">
      <CssBaseline />
      <Header siteTitle={data.site.siteMetadata?.title || 'Title'} />
      <main>{children}</main>
    </Box>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
