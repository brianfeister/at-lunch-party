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

  const setPlaces = (val) => {
    reactLocalStorage.setObject('at_lunch_last_located', val);
    _setPlaces(val || []);
  };

  const setLocated = (val) => {
    reactLocalStorage.setObject('at_lunch_last_located', val);
    _setLocated(val);
  };

  const setLatLng = (val) => {
    reactLocalStorage.setObject('at_last_lat_lng', val);
    _setLatLng(val);
  };

  useEffect(() => {
    [
      'at_lunch_last_located',
      'at_lunch_places',
      'at_last_lat',
      'at_last_lng',
    ].forEach((key: string) => {
      let storedValue = reactLocalStorage.getObject(key);
      // Check if there are no entries, if so change the empty object to an empty array
      if (Object.entries(storedValue).length === 0) {
        storedValue = [];
      }
      setPlaces(storedValue);
    });
  }, []);

  return (
    <StoreContext.Provider
      value={{
        located,
        places,
        mapRadius,
        latLng,
        googleService,
        setLocated,
        setPlaces,
        setMapRadius,
        setLatLng,
        setGoogleService,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
