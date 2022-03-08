import {
  Fragment, useContext, useCallback, useState, useEffect,
} from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import Lottie from 'react-lottie';
import { Typography } from '@material-ui/core';
import { StoreContext } from '../context/store';
import animationData from '../lotties/map-loading.json';
import PinInactive from '../images/pin-inactive.svg';
import PinActive from '../images/pin-active.svg';
import { PlaceCard } from './resultsSidebar';

const DEFAULT_ZOOM: number = 17;

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

// NOTE: only necessary because gatsby build compiles server side via Node
const isBrowser = () => typeof window !== 'undefined';

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

const getCurrentLocation = async ({ setLatLng, setLocated, latLng }) => {
  let pos = null;

  // we have a previous location, but we're offline
  if (isBrowser() && !navigator?.onLine && latLng) {
    pos = latLng;
  }

  if (isBrowser() && navigator?.geolocation?.getCurrentPosition) {
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
          setLocated(true);
        }

        if (__map?.setCenter) {
          __map.setCenter(pos);
        }
      },
      () => {
        // user has likely denied location access
        setLocated(false);
      },
    );
  } else {
    // Browser doesn't support Geolocation
    setLocated(false);
  }

  return pos;
};

const PlaceMarker = ({ place }: { place: object }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const { toggleFavorite, searchQuery } = useContext(StoreContext);
  const popperId = 'filter';

  let otherClickEvent;

  const onOtherClick = () => {
    otherClickEvent = window.addEventListener('click', () => {
      setPopupVisible(false);
    });
  };

  const showPopup = (e) => {
    e.domEvent.preventDefault();
    e.domEvent.stopPropagation();
    setPopupVisible(true);
  };

  useEffect(() => {
    if (popupVisible === true) {
      onOtherClick();
    }
  }, [popupVisible]);

  return (
    <Marker
      visible={
        searchQuery === ''
        || place?.name?.toLowerCase?.()?.match(searchQuery.toLowerCase())?.[0]
          ?.length > 0
      }
      position={place?.geometry?.location}
      map={__map}
      icon={{
        url: place?.favorite ? PinActive : PinInactive,
        // this code can't execute unless google api is loaded
        // eslint-disable-next-line no-undef
        size: new google.maps.Size(100, 100),
        // eslint-disable-next-line no-undef
        scaledSize: new google.maps.Size(32, 32),
        // eslint-disable-next-line no-undef
        origin: new google.maps.Point(0, 0),
        // eslint-disable-next-line no-undef
        anchor: new google.maps.Point(16, 16),
      }}
      onClick={showPopup}
      aria-haspopup="true"
      onDblClick={() => {
        toggleFavorite(place);
      }}
      // NOTE: these kinds of lifecycle events made React difficult to manage
      // and for this reason, React hooks were a huge improvement, in this case
      // material-ui's <ClickAwayListener /> does not work with the Google Maps
      // React lib being used as it is written in pre-hooks React and expects
      // children components to be capable of `useForwardRef` but <InfoWindow>
      // is not. Hence, we add a global even listener and clean it up on unMount
      // to prevent memory leaks
      onUnmount={() => {
        window.removeEventListener('click', otherClickEvent);
      }}
    >
      {popupVisible && (
        <InfoWindow
          id={popperId}
          options={{
            // eslint-disable-next-line no-undef
            pixelOffset: new google.maps.Size(-37, 0),
          }}
          position={place?.geometry?.location}
        >
          <PlaceCard key={place?.place_id} place={place} width={320} />
        </InfoWindow>
      )}
    </Marker>
  );
};

const MainMap = ({ classes }: { classes: object }) => {
  const {
    setLatLng,
    latLng,
    places,
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
      center: latLng,
      zoom: DEFAULT_ZOOM,
      mapTypeId: 'terrain', // roadmap | satellite | hybrid | terrain
      styles: [
        {
          featureType: 'all',
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
      ],
    });
    const service = new window.google.maps.places.PlacesService(mapInstance);
    setGoogleService(() => service);

    const nearbyRequest = {
      location: latLng,
      radius: 500,
      type: ['restaurant'],
      // don't show places that are temporarily / permanently closed
      business_status: 'OPERATIONAL',
    };

    service.nearbySearch(
      nearbyRequest,
      (res) => {
        // don't overwrite potentially useful previous results in local storage unless
        // we have a meaningful response from the places service
        if (res?.length > 0) {
          setPlaces(res);
        }
      },
      (err) => {
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

  const renderMap = () => (
    <GoogleMap
      mapRef={__map}
      mapContainerStyle={MAP_CONTAINER_STYLE}
      options={{
        center: latLng,
        zoom: DEFAULT_ZOOM,
      }}
      onLoad={onLoad}
    >
      {places?.map((place) => (
        <PlaceMarker key={place.place_id} place={place} />
      ))}
    </GoogleMap>
  );

  if (loadError) {
    return (
      <MapLoadingSkeleton
        classes={classes}
        text={"Map can't be loaded right now"}
      />
    );
  }
  if (isBrowser() && !navigator?.onLine) {
    return (
      <MapLoadingSkeleton
        classes={classes}
        text={"You appear to be offline, we can't locate you"}
      />
    );
  }

  if (!isLoaded || located === undefined) {
    return <MapLoadingSkeleton classes={classes} text="Locating you..." />;
  }

  return (
    <>
      {isLoaded
      // For users who have denied location access (located === false), show the
      // map without geolocation map center assumption – defaults to Taos, NM
      && (located === true || located === false)
      && isBrowser()
      && navigator?.onLine ? (
          renderMap()
        ) : (
          <MapLoadingSkeleton classes={classes} text="Something went wrong..." />
        )}
    </>
  );
};

export default MainMap;
