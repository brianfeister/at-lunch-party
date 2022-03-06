import { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { StoreContext } from '../context/store';

const useStyles = makeStyles((theme) => ({
  container: {
    overflowY: 'scroll',
    height: 'calc(100vh - 5.5rem)',
    width: '35vw',
    background: '#f2f2f2',
    [theme.breakpoints.down('md')]: {
      // TODO: decide about drawer vs other hide / show for final mobile
      // for now, we hide it

      display: 'none',
      // width: '100%',
      // height: 'auto',
      // position: 'relative',
    },
  },
  card: {
    margin: '1vw',
    width: '33vw',
    [theme.breakpoints.down('md')]: {
      width: '96vw',
      margin: '2vw',
    },
  },
  sidebarMessage: {
    textAlign: 'center',
    padding: '3vw',
  },
}));

const ResultsSidebar = () => {
  const classes = useStyles();
  const { places, sidebarError } = useContext(StoreContext);

  if (sidebarError) {
    return (
      <Box className={classes.container}>
        <Typography
          className={classes.sidebarMessage}
          variant="h5"
          component="h3"
        >
          {sidebarError}
        </Typography>
      </Box>
    );
  }

  if (places?.length <= 0) {
    return (
      <Box className={classes.container}>
        <Typography
          className={classes.sidebarMessage}
          variant="h5"
          component="h3"
        >
          Searching for nearby restaurants...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={classes.container}>
      {places
        && places.map((place) => (
          <Card className={classes.card} variant="outlined">
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
                variant="h6"
              >
                {place.name}
              </Typography>
            </CardContent>
          </Card>
        ))}
    </Box>
  );
};
export default ResultsSidebar;
