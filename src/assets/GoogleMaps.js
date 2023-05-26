import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { setLatLongCoordinates } from '../redux/slices/customer/site';
import { CONFIG } from '../config-global';


const containerStyle = {
  width: '400px',
  height: '400px'
};

const defaultCenter = {
  lat: -37.78686042520777,
  lng: 175.28343200683594
};

GoogleMaps.propTypes = {
  lat: PropTypes.string,
  lng: PropTypes.string,
  edit: PropTypes.bool,
};

/* eslint-disable */

export default function GoogleMaps({ lat, lng, edit = false }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey:  CONFIG.GOOGLE_MAPS_API_KEY || ''
  });


  const dispatch = useDispatch();
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (map && lat && lng && !isNaN(lat) && !isNaN(lng)) {
      const position = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };
      // map.panTo(position);
      setMarkerPosition(position);
    }
  }, [map, lat, lng]);

  const onLoad = (map) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  const onMapClick = (event) => {
    if (edit) {
      const latLng = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      setMarkerPosition(latLng);
      dispatch(setLatLongCoordinates(latLng));
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPosition || defaultCenter}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={onMapClick}
    >
      {markerPosition && <Marker position={markerPosition} draggable={edit} ref={markerRef} />}
    </GoogleMap>
  ) : (
    <></>
  );
}
