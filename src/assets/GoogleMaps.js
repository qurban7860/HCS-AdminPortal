import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { setLatLongCoordinates } from '../redux/slices/customer/site';
import { CONFIG } from '../config-global';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: -36.902893343776185,
  lng: 174.92608245309523,
};

GoogleMaps.propTypes = {
  lat: PropTypes.string,
  lng: PropTypes.string,
  edit: PropTypes.bool,
  // latlongArr: PropTypes.arrayOf(PropTypes.shape({
  //   lat: PropTypes.string.isRequired,
  //   lng: PropTypes.string.isRequired,
  // })),
};

/* eslint-disable */
export default function GoogleMaps({ lat, lng, edit = false, latlongArr = [] }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: CONFIG.GOOGLE_MAPS_API_KEY || '',
  });

  const dispatch = useDispatch();
  const [map, setMap] = useState(null);
  const [markerPositions, setMarkerPositions] = useState([]);
  const markerRefs = useRef([]);

  useEffect(() => {
    if (map && lat && lng && !isNaN(lat) && !isNaN(lng)) {
      const position = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
      setMarkerPositions([position]);
    }
  }, [map, lat, lng]);

  useEffect(() => {
    if (map && latlongArr.length > 0) {
      const positions = latlongArr
        .filter(({ lat, long }) => !isNaN(parseFloat(lat)) && !isNaN(parseFloat(long)))
        .map(({ lat, long }) => ({
          lat: parseFloat(lat),
          lng: parseFloat(long),
        }));
      setMarkerPositions(positions);
    }
  }, [map, latlongArr]);
  
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
        lng: event.latLng.lng(),
      };
      setMarkerPositions([latLng]);
      dispatch(setLatLongCoordinates(latLng));
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPositions.length > 0 ? markerPositions[0] : defaultCenter}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={onMapClick}
    >
      {markerPositions.map((position, index) => (
        <Marker key={index} position={position} draggable={edit} ref={(ref) => markerRefs.current[index] = ref} />
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
}
