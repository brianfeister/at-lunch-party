import { useContext, useCallback, useEffect } from 'react';
import { useJsApiLoader, GoogleMap } from '@react-google-maps/api';
import { StoreContext } from '../context/store';

const DEFAULT_ZOOM: number = 12;

const MAP_CONTAINER_STYLE: object = {
  height: '100%',
  width: '100%',
};

// NOTE: Google maps API is unhappy with React.js lifecycle object mutations and
// considers this prop value slippage (which in turn causes Google Maps) to complain
// about it being unacceptable to change `libraries` as a query param
const libraries = ['places'];

// eslint-disable-next-line no-underscore-dangle
let __map;

const getCurrentLocation = async ({ setLatLng, setLocated }) => {
  let pos = null;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLatLng(pos);
        setLocated(pos);
        __map?.setCenter(pos);
      },
      () => {
        setLocated(pos);
      },
    );
  } else {
    // Browser doesn't support Geolocation
    setLocated(pos);
  }
  return pos;
};

const MainMap = () => {
  const {
    setLatLng,
    latLng,
    setPlaces,
    setGoogleService,
    located,
    setLocated,
  } = useContext(StoreContext);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.GATSBY_GOOGLE_API_KEY,
    libraries,
  });

  const onLoad = useCallback((mapInstance) => {
    __map = new window.google.maps.Map(document.getElementById('map'), {
      center: located || latLng,
      zoom: DEFAULT_ZOOM,
      // TODO: map styles?
      // styles: mapStyle,
    });
    const service = new window.google.maps.places.PlacesService(mapInstance);
    setGoogleService(() => service);

    const request = {
      location: located || latLng,
      radius: 500,
      type: ['restaurant'],
    };
    service.nearbySearch(
      request,
      (res) => {
        setPlaces(res);
      },
      (err) => {
        // TODO: handle for error
        // eslint-disable-next-line
        console.log('~err', err);
      },
    );
  });

  // Request user location
  useEffect(() => {
    getCurrentLocation({ setLatLng, setLocated }).then((__located) => {
      if (__located !== null && window?.google?.maps) {
        onLoad(__map);
      }
    });
  }, []);

  // TODO: places API response stopped returning results
  // for some reason works when geolocation is denied
  const renderMap = () => (
    <GoogleMap
      mapRef={__map}
      setMapCallback={() => {
        // TODO: handle for map / places data change here if needed?
      }}
      mapContainerStyle={MAP_CONTAINER_STYLE}
      options={{
        center: latLng,
        zoom: DEFAULT_ZOOM,
      }}
      onLoad={onLoad}
    />
  );

  if (loadError) return <>Map can't be loaded right now</>;
  // TODO: loading skeleton
  return <>{isLoaded && located !== undefined ? renderMap() : null}</>;
};

export default MainMap;
