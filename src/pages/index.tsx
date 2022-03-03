import { ReactElement } from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import { makeStyles, Typography, Box } from '@material-ui/core';

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
  image: {
    margin: '0 0.5rem 1.45rem',
  },
});

function IndexPage(): ReactElement {
  const classes = useStyles();
  return (
    <Layout>
      <SEO title="Home" />
      <Typography variant="h3" component="h3" className={classes.title}>
        Hi people
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        Welcome to your new Gatsby site with Typescript & Material UI.
      </Typography>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        Now go build something great.
      </Typography>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
      >
        <StaticImage
          src="../images/gatsby-astronaut.png"
          width={300}
          quality={100}
          formats={['auto', 'webp', 'avif']}
          alt="A Gatsby astronaut"
          className={classes.image}
        />
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
        >
          <StaticImage
            src="../images/gatsby-icon.png"
            width={80}
            quality={100}
            formats={['auto', 'webp', 'avif']}
            alt="A Gatsby icon"
            className={classes.image}
          />
          <StaticImage
            src="../images/typescript-icon.png"
            width={80}
            quality={100}
            formats={['auto', 'webp', 'avif']}
            alt="A Typescript icon"
            className={classes.image}
          />
          <StaticImage
            src="../images/material-ui-icon.png"
            width={80}
            quality={100}
            formats={['auto', 'webp', 'avif']}
            alt="A Material UI icon"
            className={classes.image}
          />
        </Box>
      </Box>
      <Typography variant="body1" component="p" className={classes.paragraph}>
        <Link to="/page-2/">Go to page 2</Link>
      </Typography>
    </Layout>
  );
}

export default IndexPage;
