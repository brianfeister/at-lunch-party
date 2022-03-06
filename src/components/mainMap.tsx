import { useContext, useCallback, useEffect } from 'react';
import { useJsApiLoader, GoogleMap } from '@react-google-maps/api';
import Lottie from 'react-lottie';
import { Typography } from '@material-ui/core';
import { StoreContext } from '../context/store';
import animationData from '../lotties/map-loading.json';

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

const MapLoadingSkeleton = ({
  classes,
  text,
}: {
  classes: object;
  text?: string;
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className={classes.map}>
      {text ? (
        <Typography className={classes.mapLabel} variant="h4" component="h3">
          {text}
        </Typography>
      ) : null}
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

const getCurrentLocation = async ({
  setLatLng,
  setLocated,
  located,
  latLng,
}) => {
  let pos = null;

  // we have a previous location, but we're offline
  if (!navigator.onLine && (located || latLng)) {
    pos = located || latLng;
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (
          typeof position?.coords?.latitude === 'number'
          && typeof position?.coords?.longitude === 'number'
        ) {
          setLatLng(pos);
          setLocated(pos);
        }

        if (__map?.setCenter) {
          __map.setCenter(pos);
        }
      },
      () => {
        // user has likely denied location accessp
        setLocated(undefined);
      },
    );
  } else {
    // Browser doesn't support Geolocation
    setLocated(pos);
  }

  return pos;
};

interface IMainMap {
  classes: object;
}

const MainMap = ({ classes }: IMainMap) => {
  const {
    setLatLng,
    latLng,
    setPlaces,
    setGoogleService,
    located,
    setLocated,
    setSidebarError,
  } = useContext(StoreContext);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.GATSBY_GOOGLE_API_KEY,
    libraries,
  });

  const onLoad = useCallback((mapInstance) => {
    // prevent errors for offline app context
    if (!window?.google?.maps) return;

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
        // don't overwrite potentially useful previous results in local storage unless
        // we have a meaningful response from the places service
        if (res.length > 0) {
          setPlaces(res);
        }
      },
      (err) => {
        // TODO: handle for error
        // eslint-disable-next-line no-console
        console.log('~err', err);
        setSidebarError(
          `Received the following error fetching nearby places. Error: ${err}`,
        );
      },
    );
  });

  // Request user location
  useEffect(() => {
    getCurrentLocation({
      setLatLng,
      setLocated,
      located,
      latLng,
    }).then((__located) => {
      // don't trigger onload map callback if user is offline in which
      // case window?.google?.maps is always falsy - would be cool if
      // Google api worked offline but that would decrease their leverage
      // 😅 https://www.quora.com/Why-does-not-Google-release-an-API-to-support-Google-Maps-in-offline-mode-for-mobile-apps
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
        center: located || latLng,
        zoom: DEFAULT_ZOOM,
      }}
      onLoad={onLoad}
    />
  );

  if (loadError) {
    return (
      <MapLoadingSkeleton
        classes={classes}
        text={"Map can't be loaded right now"}
      />
    );
  }
  if (!navigator?.onLine) {
    return (
      <MapLoadingSkeleton
        classes={classes}
        text={"You appear to be offline, we can't locate you"}
      />
    );
  }

  if (!isLoaded) {
    return <MapLoadingSkeleton classes={classes} text="Locating you..." />;
  }

  // For users who have denied location access, show the map without
  // geolocation map center assumption – defaults to Taos, NM
  if (navigator?.onLine && !located && isLoaded) {
    return renderMap();
  }

  return (
    <>
      {isLoaded && located !== undefined && navigator?.onLine ? (
        renderMap()
      ) : (
        <MapLoadingSkeleton classes={classes} text="Something went wrong..." />
      )}
    </>
  );
};

export default MainMap;
