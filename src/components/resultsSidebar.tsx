// NOTE: Executive decision to punt a11y compliance as not part of "production code"
// in this context because using the static SVGs here is a means of improving performance
// in a production application, it's ideal to lean on a UI library like material-ui for
// a11y handling unless an organization has lots of engineering resources. In this project
// svgs are referenced directly as base64 images from Gatsby, which is more performant
// "production quality" could some times prioritize a11y, sometimes render times, and with
// sufficient time, both can be achieved.

// TLDR: disable a11y for clickable images

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { StoreContext } from '../context/store';
import RestaurantFallback from '../images/restaurant-fallback.svg';
import StarFilled from '../images/star-filled.svg';
import StarEmpty from '../images/star-empty.svg';
import FavActive from '../images/favorite-active.svg';
import FavInactive from '../images/favorite-inactive.svg';

const useStyles = makeStyles((theme) => ({
  container: {
    overflowY: 'scroll',
    height: 'calc(100vh - 5.5rem)',
    width: '35vw',
    background: '#f2f2f2',
    padding: '1vw',
    [theme.breakpoints.down('md')]: {
      // TODO: decide about drawer vs other hide / show for final mobile
      // for now, we hide it

      display: 'none',
      // width: '100%',
      // height: 'auto',
      // position: 'relative',
    },
  },
  contentCard: {
    paddingBottom: '0 !important',
  },
  card: {
    margin: '1vw',
    width: '31vw',
    paddingBottom: 16,
    [theme.breakpoints.down('md')]: {
      width: '94vw',
      margin: '2vw',
    },
  },
  sidebarMessage: {
    textAlign: 'center',
    padding: '3vw',
  },
  listHeading: {
    fontWeight: 'bold',
    marginRight: 32,
    whiteSpace: 'inherit',
    lineHeight: 1.4,
  },
  placeContainer: {
    position: 'relative',
  },
  placeImage: {
    width: 100,
    height: 100,
    objectFit: 'cover',
    float: 'left',
    // paddingBottom: 16,
    marginRight: 12,
  },
  innerRow: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: 'auto',
    overflow: 'hidden',
  },
  favorite: {
    position: 'absolute',
    top: 7,
    right: 7,
    cursor: 'pointer',
  },
}));

const SidebarTitle = ({ classes, text }: { classes: object; text: string }) => (
  <Typography className={classes.sidebarMessage} variant="h5" component="h3">
    {text}
  </Typography>
);

export const PlaceCard = ({
  place,
  width,
}: {
  place: object;
  width: number;
}) => {
  const classes = useStyles();
  const { toggleFavorite } = useContext(StoreContext);
  let ratings = Array.from({ length: 5 }, (v, i) => i);
  const roundedRating = Math.floor(parseFloat(place?.rating));
  ratings = ratings.map((val) => (roundedRating > val ? '+' : '-'));
  const priceLevel = Array.from(
    { length: parseInt(place?.price_level, 10) },
    (v, i) => i,
  );

  return (
    <div className={classes.placeContainer} style={{ width: width ?? 'auto' }}>
      <img
        alt={place?.name}
        className={classes.favorite}
        src={place?.favorite ? FavActive : FavInactive}
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          toggleFavorite(place);
        }}
      />
      <img
        className={classes.placeImage}
        alt={place.name}
        src={
          place?.photos?.[0]?.getUrl
            ? place?.photos?.[0]?.getUrl({
              maxWidth: 150,
              maxHeight: 150,
            })
            : RestaurantFallback
        }
      />
      <div>
        <Typography className={classes.listHeading} variant="h6">
          {place.name}
        </Typography>
        {place?.rating && place?.user_ratings_total && (
          <div>
            {ratings.map((isStar) => (
              <img alt="star" src={isStar === '+' ? StarFilled : StarEmpty} />
            ))}
            {' '}
            (
            {place?.user_ratings_total?.toLocaleString('en-US')}
            )
          </div>
        )}
        <div className={classes.innerRow}>
          {place?.price_level ? (
            <>
              {priceLevel.map(() => (
                <>$</>
              ))}
              {' '}
              &bull;
              {' '}
            </>
          ) : null}
          {place?.vicinity}
        </div>
      </div>
    </div>
  );
};

const ResultsSidebar = () => {
  const classes = useStyles();
  const {
    places, sidebarError, searchQuery, searchSort,
  } = useContext(
    StoreContext,
  );

  if (sidebarError) {
    return (
      <Box className={classes.container}>
        <SidebarTitle classes={classes} text={sidebarError} />
      </Box>
    );
  }

  if (places?.length <= 0) {
    return (
      <Box className={classes.container}>
        <SidebarTitle
          classes={classes}
          text="Searching for nearby restaurants..."
        />
      </Box>
    );
  }

  const filteredPlaces = places.filter((place) => {
    if (!place.name.toLowerCase().match(searchQuery.toLowerCase())) {
      return null;
    }
    return place;
  });

  filteredPlaces.sort((a, b) => {
    if (searchSort === 'ascending') {
      if (a.rating < b.rating) {
        return -1;
      }
      if (a.rating > b.rating) {
        return 1;
      }
    }
    if (searchSort === 'descending') {
      if (a.rating > b.rating) {
        return -1;
      }
      if (a.rating < b.rating) {
        return 1;
      }
    }
    return 0;
  });

  if (!filteredPlaces || filteredPlaces?.length < 1) {
    return (
      <Box className={classes.container}>
        <SidebarTitle
          classes={classes}
          text="No nearby restaurants match your search"
        />
      </Box>
    );
  }

  return (
    <Box className={classes.container}>
      {filteredPlaces.map((place) => (
        <Card key={place?.place_id} className={classes.card} variant="outlined">
          <CardContent className={classes.contentCard}>
            <PlaceCard place={place} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
export default ResultsSidebar;
