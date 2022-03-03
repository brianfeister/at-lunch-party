import { ReactElement } from 'react';
import { Link } from 'gatsby';
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

function SecondPage(): ReactElement {
  const classes = useStyles();
  return (
    <Layout>
      <SEO title="Page Two" />
      <Typography variant="h3" component="h3" className={classes.title}>
        Hi from the second page
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        Welcome to page 2
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        <Link to="/">Go back to the homepage</Link>
      </Typography>
    </Layout>
  );
}

export default SecondPage;
