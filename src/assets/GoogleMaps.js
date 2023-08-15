import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Grid } from '@mui/material';
import { setLatLongCoordinates } from '../redux/slices/customer/site';
import { CONFIG } from '../config-global';


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

  const handleMarkerClick = (index, lat, lng, serialNo, name, customerName, address) => {
    let stringAddress = Object.values(address)?.join(", ");
    setInfoWindowData({index, lat, lng, name, customerName, serialNo, stringAddress});    
    if(infoWindowData){
      setIsOpen(true);
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={(latlongArr.length > 0 || machinesSites.length > 0) ? (machineView ? markerPositions[0] : reportDefaultCenter) : markerPositions[0]}
      zoom={zoom ? zoom : ((latlongArr.length > 0 || machinesSites.length > 0) && !machineView ? 2 : 15)}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={machinesSites.length > 0 ? () => setIsOpen(false) : onMapClick}

    >
      
      {machinesSites.length > 0 && machinesSites.map(({lat, lng, name, serialNo, customerName, address}, index) => (
        <Marker
          key={index}
          position={{lat: parseFloat(lat), lng: parseFloat(lng)}}
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
              <Grid container justify="center" spacing={0} sx={{margin: 0}}>
                <p>{`${infoWindowData?.serialNo} (${infoWindowData?.customerName})`}<br/>
                    {infoWindowData?.stringAddress}
                </p>
              </Grid>
            </InfoWindow>
          )}
        </Marker>
      ))}
      {markerPositions.map((position, index) => (
        <Marker
          key={index}
          position={position}
          draggable={edit}
          ref={(ref) => (markerRefs.current[index] = ref)}
        />
      ))}
    </GoogleMap>
  ) : (
    <></>
  );
}
