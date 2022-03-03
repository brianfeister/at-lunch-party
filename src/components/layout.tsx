/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */
import { ReactElement, ReactNode } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import {
  makeStyles, CssBaseline, Box, Typography,
} from '@material-ui/core';

import Header from './header';

interface LayoutProps {
  children: ReactNode;
}

const useStyles = makeStyles({
  footer: {
    marginTop: '2rem',
  },
});

function Layout({ children }: LayoutProps): ReactElement {
  const classes = useStyles();
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
      <Box
        maxWidth="960px"
        marginX="auto"
        marginY="0"
        paddingTop="0"
        paddingBottom="1.45rem"
        paddingX="1.0875rem"
      >
        <main>{children}</main>
        <footer className={classes.footer}>
          <Typography variant="body2">
            ©
            {' '}
            {new Date().getFullYear()}
            , Built with
            {' '}
            <a href="https://www.gatsbyjs.com">Gatsby</a>
          </Typography>
        </footer>
      </Box>
    </Box>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
