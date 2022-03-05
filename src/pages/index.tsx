import { makeStyles } from '@material-ui/core';
import Layout from '../components/layout';
import SEO from '../components/seo';
import MainMap from '../components/mainMap';
import ResultsSidebar from '../components/resultsSidebar';

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
  map: {
    position: 'fixed !important',
    width: '65vw',
    height: 'calc(100% - 5.5rem)',
    top: '5.5rem',
    right: 0,
  },
});

const IndexPage = () => {
  const classes = useStyles();

  return (
    <Layout>
      <SEO title="Home" />
      <ResultsSidebar />
      <MainMap />
      <div id="map" className={classes.map} />
    </Layout>
  );
};

export default IndexPage;
