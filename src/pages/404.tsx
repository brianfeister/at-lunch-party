import { ReactElement } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import Layout from '../components/layout';
import SEO from '../components/seo';

const useStyles = makeStyles({
  title: {
    fontWeight: 'bold',
    fontSize: '2.25rem',
    lineHeight: '1.1',
    marginBottom: '1.45rem',
  },
  paragraph: {
    margin: '0 0 1.45rem',
  },
});

function NotFoundPage(): ReactElement {
  const classes = useStyles();
  return (
    <Layout>
      <SEO title="404: Not found" />
      <Typography variant="h3" component="h3" className={classes.title}>
        404: Not Found
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        You just hit a route that doesn&#39;t exist... the sadness.
      </Typography>
    </Layout>
  );
}

export default NotFoundPage;
