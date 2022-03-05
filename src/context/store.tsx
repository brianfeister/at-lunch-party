import {
  createContext, useState, useEffect, ReactChildren,
} from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';

const StoreContext = createContext();

const StoreProvider = ({ children }: { children: ReactChildren }) => {
  const [located, _setLocated] = useState(undefined);
  const noop = () => {};
  const [googleService, setGoogleService] = useState(noop);
  // NOTE: This is a hack. React hooks are not well set up to handle a service pattern
  // (which is a bit antiquated relative to modern JavaScript standards)
  useEffect(() => {
    setGoogleService(() => noop);
  }, []);

  const [mapRadius, setMapRadius] = useState(50);
  // the coordinates where everyone wants to be
  const [latLng, _setLatLng] = useState({
    lat: 36.408108,
    lng: -105.572679,
  });
  const [places, _setPlaces] = useState([]);

  const setPlaces = (val) => {
    reactLocalStorage.setObject('at_lunch_last_located', val);
    _setPlaces(val);
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
