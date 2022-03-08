// NOTE: see note at top of components/resultsSidebar.tsx

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import {
  useEffect,
  useContext,
  useRef,
  useState,
  MouseEvent,
  ReactNode,
  SyntheticEvent,
} from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import copy from 'copy-to-clipboard';
import { StoreContext } from '../context/store';
import Search from '../images/search.svg';
import FilterInactive from '../images/filter-inactive.svg';
import FilterActive from '../images/filter-active.svg';

const useStyles = makeStyles((theme) => ({
  container: {
    float: 'right',
    marginTop: -7,
    [theme.breakpoints.down('md')]: {
      float: 'inherit',
      margin: '0 auto',
      paddingBottom: 20,
      textAlign: 'center',
      display: 'flex',
      placeContent: 'flex-end',
    },
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-between',
    },
  },
  searchField: {
    marginTop: 0,
    marginBottom: 0,
    float: 'right',
    minWidth: 300,
    [theme.breakpoints.down('md')]: {
      minWidth: '55vw',
      width: '55vw',
    },
  },
  filter: {
    height: 56,
    marginRight: 32,
    padding: '0 20px',
    [theme.breakpoints.down('md')]: {
      minWidth: '10vw',
      marginRight: 20,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
      padding: '0 10px',
    },
  },
  filterPopover: {
    marginTop: 12,
    padding: 20,
    border: `1px solid ${theme.palette.grey[300]}`,
  },
  filterPopoverRow: {
    width: 250,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    paddingBottom: 12,
    '&:last-of-type': {
      paddingBottom: 0,
    },
  },
  filterIcon: {
    display: 'inline-block',
    float: 'left',
    paddingRight: 12,
    marginTop: 4,
    cursor: 'pointer',
  },
  filterApply: {
    textAlign: 'right',
    fontWeight: 'bold',
    cursor: 'pointer',
    float: 'right',
  },
}));

export const PopperWithClickAway = ({
  children,
  open,
  onClose,
  anchorEl,
  onClickAway,
}: {
  children: ReactNode;
  open: boolean;
  onClose: (any) => any;
  anchorEl: HTMLElement | null;
  onClickAway: (any) => any;
}) => {
  const classes = useStyles();
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      transition
      role={undefined}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={classes.filterPopover}>
            <ClickAwayListener
              onClickAway={(e: MouseEvent) => {
                onClose(e);
                onClickAway(e);
              }}
            >
              {children}
            </ClickAwayListener>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};
const SearchBox = () => {
  const classes = useStyles();
  const {
    searchQuery,
    setSearchQuery,
    searchSort,
    setSearchSort,
    places,
  } = useContext(StoreContext);
  const popperId = 'filter';

  const [ratingSort, setRatingSort] = useState<'ascending' | 'descending'>(
    searchSort,
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setDropdownOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent<EventTarget>) => {
    if (
      anchorRef.current
      && anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setDropdownOpen(false);
  };

  const handleSnackbarClick = () => {
    const searchParams = new URLSearchParams(window.location.search);

    places.forEach((place) => {
      if (
        place?.favorite
        // don't dupe existing url params
        && !searchParams?.getAll('place_id')?.includes(place?.place_id)
      ) {
        searchParams.append('place_id', place?.place_id);
      }
    });
    const shareableUrl = `${window.location.origin}?${searchParams.toString()}`;
    copy(shareableUrl);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  // return focus after transitioning from button to clickaway
  const prevOpen = useRef(dropdownOpen);
  useEffect(() => {
    if (prevOpen.current === true && dropdownOpen === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = dropdownOpen;
  }, [dropdownOpen]);

  return (
    <div className={classes.container}>
      <PopperWithClickAway
        onOpen={handleToggle}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        popperId={popperId}
        open={dropdownOpen}
        onClickAway={() => {
          setDropdownOpen(false);
        }}
      >
        <div id={popperId}>
          <div className={classes.filterPopoverRow}>
            <img
              alt="ratings high to low"
              onClick={() => setRatingSort('descending')}
              className={classes.filterIcon}
              src={ratingSort === 'descending' ? FilterActive : FilterInactive}
            />
            <Typography>Ratings High to Low</Typography>
          </div>
          <div className={classes.filterPopoverRow}>
            <img
              alt="ratings low to high"
              onClick={() => setRatingSort('ascending')}
              className={classes.filterIcon}
              src={ratingSort === 'ascending' ? FilterActive : FilterInactive}
            />
            <Typography>Ratings Low to High</Typography>
          </div>
          <div className={classes.filterPopoverRow}>
            <Typography
              className={classes.filterApply}
              onClick={() => {
                setSearchSort(ratingSort);
                setDropdownOpen((prev) => !prev);
              }}
              color="primary"
            >
              Apply
            </Typography>
          </div>
        </div>
      </PopperWithClickAway>
      <Button
        ref={anchorRef}
        className={classes.filter}
        onClick={handleSnackbarClick}
        aria-controls={dropdownOpen ? popperId : undefined}
        aria-haspopup="true"
        variant="outlined"
      >
        Share
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity="success"
        >
          Shareable Favorites Link Copied to Clipboard!
        </MuiAlert>
      </Snackbar>
      <Button
        ref={anchorRef}
        className={classes.filter}
        onClick={handleToggle}
        aria-controls={dropdownOpen ? popperId : undefined}
        aria-haspopup="true"
        variant="outlined"
      >
        Filter
      </Button>
      <TextField
        className={classes.searchField}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        placeholder="Search for a restaurant"
        InputProps={{
          classes: {
            root: classes.root,
            focused: classes.focused,
            notchedOutline: classes.notchedOutline,
          },
          endAdornment: (
            <InputAdornment position="end">
              <img src={Search} alt="Search nearby restaurants" />
            </InputAdornment>
          ),
        }}
        label=""
        variant="outlined"
        margin="normal"
        value={searchQuery}
      />
    </div>
  );
};

export default SearchBox;
