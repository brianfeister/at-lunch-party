import { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Layout from '../components/layout';
import SEO from '../components/seo';
import MainMap from '../components/mainMap';
import ResultsSidebar from '../components/resultsSidebar';
import { StoreContext } from '../context/store';
import ListIcon from '../images/list-icon.svg';
import MapIcon from '../images/map-icon.svg';

const useStyles = makeStyles((theme) => ({
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
  // NOTE: !important styles here are necessary to override
  // google maps inline styles
  map: {
    display: (props) => (props.openView === 'list' ? 'none' : 'inherit'),
    position: 'fixed !important',
    width: '65vw',
    height: 'calc(100% - 5.5rem)',
    top: '5.5rem',
    right: 0,
    [theme.breakpoints.down('md')]: {
      position: 'fixed !important',
      width: '100%',
      height: '100vh',
      zIndex: '-1',
    },
  },
  resultsSidebar: {
    display: (props) => (props.openView === 'map' ? 'none' : 'inherit'),
  },
  mapLabel: {
    textAlign: 'center',
    width: '100%',
  },
  mobileToggle: {
    position: 'fixed',
    bottom: 30,
    left: 'calc(50vw - 50px)',
    fontSize: '1.2rem',
    width: 100,
    fontWeight: 'bold',
    textTransform: 'none',
  },
  // 🎉 oh the joys of integrating multiple JS systems (React + Google Maps)
  '@global': {
    '.gm-ui-hover-effect': {
      display: 'none !important',
    },
    '.gm-style .gm-style-iw-c': {
      paddingBottom: '0 !important',
    },
    '.gm-style .gm-style-iw-d': {
      marginBottom: '0 !important',
    },
  },
}));

const MobileToggle = ({
  openView,
  setOpenView,
  classes,
}: {
  openView: 'map' | 'list' | null;
  setOpenView: (any) => any;
  classes: object;
}) => (
  <Button
    className={classes.mobileToggle}
    onClick={() => {
      const newView = openView === 'map' ? 'list' : 'map';
      setOpenView(newView);
    }}
    variant="contained"
    color="primary"
  >
    {openView === 'map' ? (
      <>
        <img alt="list" src={ListIcon} />
        &nbsp;List
      </>
    ) : (
      <>
        <img alt="map" src={MapIcon} />
        &nbsp;Map
      </>
    )}
  </Button>
);

const IndexPage = () => {
  const { openView, setOpenView } = useContext(StoreContext);
  const classes = useStyles({ openView });
  return (
    <Layout>
      <SEO title="Home" />
      {(openView === 'list' || openView === null) && <ResultsSidebar />}
      <MainMap classes={classes} />
      <div id="map" className={classes.map} />
      <MobileToggle
        classes={classes}
        openView={openView}
        setOpenView={setOpenView}
      />
    </Layout>
  );
};

export default IndexPage;
