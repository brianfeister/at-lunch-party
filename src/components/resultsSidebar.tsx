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
    [theme.breakpoints.down('md')]: {},
  },
  card: {
    margin: '1vw',
    width: '33vw',
  },
}));

const ResultsSidebar = () => {
  const classes = useStyles();
  const { places } = useContext(StoreContext);
  return (
    <Box className={classes.container}>
      {places.map((place) => (
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
