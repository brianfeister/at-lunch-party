import {
  createContext, useState, useEffect, ReactChildren,
} from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const defaultState = {
  located: undefined,
  places: [],
  mapRadius: 50,
  latLng: {
    lat: 36.408108,
    lng: -105.572679,
  },
  googleService: () => {},
};

const isEmptyObject = (obj: any) => obj
  && Object.keys(obj).length === 0
  && Object.getPrototypeOf(obj) === Object.prototype;

const StoreContext = createContext(defaultState);

const StoreProvider = ({ children }: { children: ReactChildren }) => {
  const qsFavorites = new URLSearchParams(window.location.search).getAll(
    'place_id',
  );

  const [initialFavorites] = useState(qsFavorites ?? []);

  const [located, _setLocated] = useState(defaultState.located);
  const [googleService, setGoogleService] = useState(
    defaultState.googleService,
  );
  const [places, _setPlaces] = useState(defaultState.places);
  // NOTE: This is a hack. React hooks are not well set up to handle a service pattern
  // (which is a bit antiquated relative to modern JavaScript standards)
  useEffect(() => {
    setGoogleService(() => defaultState.googleService);
  }, []);

  const [mapRadius, setMapRadius] = useState(defaultState.mapRadius);
  // the coordinates where everyone wants to be
  const [latLng, _setLatLng] = useState(defaultState.latLng);
  const [sidebarError, setSidebarError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSort, setSearchSort] = useState<'ascending' | 'descending'>(
    'descending',
  );
  const [openView, setOpenView] = useState<'map' | 'list' | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // initially set the store with 'list' when the client loads and we know
  // the user is at the mobile breakpoint, this defaults to `null` for the
  // default desktop view and so we have an enum 'mobil' | 'list' | null
  useEffect(() => {
    if (openView === null && isMobile) {
      setOpenView('list');
    }
  }, [isMobile]);

  const setPlaces = (val) => {
    // NOTE: google.maps.places service isn't typescript friendly here the return
    // of service.nearbySearch is an `array` but `typeof res === 'object'`

    // cooerce google maps object to array
    let objectToArray = val?.length > 0 ? val : [];

    objectToArray = objectToArray.map((place) => ({
      ...place,
      // initially set places from url string, but also allow toggle
      ...(initialFavorites.includes(place?.place_id)
        ? { favorite: place?.favorite === undefined ? true : place?.favorite }
        : {}),
    }));
    reactLocalStorage.setObject('at_lunch_places', objectToArray);
    _setPlaces(objectToArray);
  };

  const setLocated = (val) => {
    reactLocalStorage.setObject('at_lunch_located', val);
    _setLocated(val);
  };

  const setLatLng = (val) => {
    if (val?.lat && val.lng) {
      reactLocalStorage.setObject('at_lunch_lat_lng', val);
      _setLatLng(val);
    }
  };

  const toggleFavorite = (targetPlace: any) => {
    setPlaces(
      places.map((place) => ({
        ...place,
        ...(targetPlace?.place_id === place?.place_id
          ? { favorite: !place?.favorite }
          : {}),
      })),
    );
  };

  useEffect(() => {
    ['at_lunch_places', 'at_lunch_located', 'at_lunch_lat_lng'].forEach(
      (key: string) => {
        const storedValue = reactLocalStorage.getObject(key);
        // NOTE: localstorage returns empty object for previously stored values
        if (isEmptyObject(storedValue)) {
          return;
        }
        switch (key) {
          case 'at_lunch_places':
            setPlaces(storedValue);
            break;
          case 'at_lunch_located':
            setLocated(storedValue);
            break;
          case 'at_lunch_lat_lng':
            setLatLng(storedValue);
            break;
          default:
            break;
        }
      },
    );
  }, []);

  return (
    <StoreContext.Provider
      value={{
        located,
        places,
        mapRadius,
        latLng,
        googleService,
        sidebarError,
        searchQuery,
        searchSort,
        openView,
        isMobile,
        setLocated,
        setPlaces,
        setMapRadius,
        setLatLng,
        setGoogleService,
        setSidebarError,
        setSearchQuery,
        setSearchSort,
        toggleFavorite,
        setOpenView,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
