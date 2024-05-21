import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Button, Grid, Typography } from '@mui/material';
import Iconify from '../components/iconify/Iconify';
import { setLatLongCoordinates } from '../redux/slices/customer/site';
import { CONFIG } from '../config-global';
import { ICONS } from '../constants/icons/default-icons';

const reportDefaultCenter = {
  lat: 26.902893343776185,
  lng: 174.92608245309523,
};

GoogleMaps.propTypes = {
  lat: PropTypes.string,
  lng: PropTypes.string,
  edit: PropTypes.bool,
  machineView: PropTypes.bool,
  // latlongArr: PropTypes.arrayOf(PropTypes.shape({
  //   lat: PropTypes.string.isRequired,
  //   lng: PropTypes.string.isRequired,
  // })),
};

/* eslint-disable */
export default function GoogleMaps({
  lat,
  lng,
  edit = false,
  machineView = false,
  latlongArr = [],
  mapHeight = '',
  center = '',
  zoom = '',
  machinesSites = [],
}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: CONFIG.GOOGLE_MAPS_API_KEY || '',
  });

  const containerStyle = {
    width: '100%',
    height: !mapHeight ? (latlongArr.length > 0 ? '800px' : '400px') : mapHeight,
  };
  const dispatch = useDispatch();
  const [map, setMap] = useState(null);
  const [markerPositions, setMarkerPositions] = useState([]);
  const markerRefs = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(0);

  useEffect(() => {
    if (map && lat && lng && !isNaN(lat) && !isNaN(lng)) {
      const position = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
      setMarkerPositions([position]);
    }
  }, [map, lat, lng]);

  const handleZoomClick = (newZoomLevel) => {
    setZoomLevel(newZoomLevel);
    map.setZoom(newZoomLevel);
  };

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

  const handleMarkerClick = (index, lat, lng, serialNo, name, customerName, address) => {
    let stringAddress = Object.values(address)?.join(', ');
    setInfoWindowData({ index, lat, lng, name, customerName, serialNo, stringAddress });
    if (infoWindowData) {
      setIsOpen(true);
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={
        latlongArr.length > 0 || machinesSites.length > 0
          ? machineView
            ? markerPositions[0]
            : reportDefaultCenter
          : markerPositions[0]
      }
      zoom={
        zoom ? zoom : (latlongArr.length > 0 || machinesSites.length > 0) && !machineView ? 2 : 15
      }
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={machinesSites.length > 0 ? () => setIsOpen(false) : onMapClick}
    >
      {machinesSites.length > 0 &&
        machinesSites.map(({ lat, lng, name, serialNo, customerName, address }, index) => (
          <m.div>
            <Marker
              key={index}
              position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
              icon={{ ...ICONS.MAP_MARKER, scaledSize: new window.google.maps.Size(25, 25) }}
              draggable={edit}
              ref={(ref) => (markerRefs.current[index] = ref)}
              onMouseOver={() => {
                handleMarkerClick(index, lat, lng, serialNo, name, customerName, address);
              }}
            >
              {isOpen && infoWindowData && infoWindowData?.index === index && (
                <InfoWindow
                  onCloseClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <Grid container spacing={0} sx={{ margin: 0 }}>
                    <Grid item maxWidth={300} textAlign='center'>
                      <Typography variant='h6' textAlign='left'>{`${infoWindowData?.serialNo} (${infoWindowData?.customerName})`}</Typography>
                      <Typography variant='body2' textAlign='left'>{infoWindowData?.stringAddress}</Typography>  
                      <Button variant='' disableRipple
                        onClick={() => {
                          // handleZoomClick(zoomLevel !== 15 ? 15 : 2);
                          map.setCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });
                        }}
                        startIcon={<Iconify icon={zoomLevel !== 15 ? 'iconamoon:zoom-in-bold' : 'iconamoon:zoom-out-bold'} />}>
                          {zoomLevel !== 15 ? ' Zoom In' : ' Zoom Out'}
                      </Button>
                    </Grid>
                  </Grid>
                </InfoWindow>
              )}
            </Marker>
          </m.div>
        ))}
      {markerPositions.map((position, index) => (
        <m.div>
          <Marker
            key={index}
            position={position}
            icon={{ ...ICONS.MAP_MARKER, scaledSize: new window.google.maps.Size(50, 50) }}
            draggable={edit}
            ref={(ref) => (markerRefs.current[index] = ref)}
          />
        </m.div>
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
}
