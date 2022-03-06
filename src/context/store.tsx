import {
  createContext, useState, useEffect, ReactChildren,
} from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';

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

const StoreContext = createContext(defaultState);

const StoreProvider = ({ children }: { children: ReactChildren }) => {
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

  const setPlaces = (val) => {
    // NOTE: google.maps.places service isn't typescript friendly here the return
    // of service.nearbySearch is an `array` but `typeof res === 'object'`

    // cooerce google maps object to array
    const objectToArray = val?.length > 0 ? val : [];
    reactLocalStorage.setObject('at_lunch_places', objectToArray);
    _setPlaces(objectToArray);
  };

  const setLocated = (val) => {
    reactLocalStorage.setObject('at_lunch_last_located', val);
    _setLocated(val);
  };

  const setLatLng = (val) => {
    if (val?.lat && val.lng) {
      reactLocalStorage.setObject('at_lunch_lat_lng', val);
      _setLatLng(val);
    }
  };

  useEffect(() => {
    ['at_lunch_places', 'at_lunch_last_located', 'at_lunch_lat_lng'].forEach(
      (key: string) => {
        const storedValue = reactLocalStorage.getObject(key);

        switch (key) {
          case 'at_lunch_places':
            setPlaces(storedValue);
            break;
          case 'at_lunch_last_located':
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
        setLocated,
        setPlaces,
        setMapRadius,
        setLatLng,
        setGoogleService,
        setSidebarError,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
