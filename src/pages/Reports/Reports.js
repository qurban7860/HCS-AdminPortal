// import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
// import { useNavigate,  } from 'react-router-dom';
// import { useTheme } from '@mui/material/styles';
import { Container, Grid, Card } from '@mui/material';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import CategoryIcon from '@mui/icons-material/Category';
// import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
// import InventoryIcon from '@mui/icons-material/Inventory';
// import Diversity1Icon from '@mui/icons-material/Diversity1';
// import FlareIcon from '@mui/icons-material/Flare';
// import ClassIcon from '@mui/icons-material/Class';
// import BuildCircleIcon from '@mui/icons-material/BuildCircle';
// import {  PATH_DOCUMENT } from '../../routes/paths';
// import { searchSites } from '../../redux/slices/customer/site';
import { getMachineLatLongData } from '../../redux/slices/products/machine';
import { useDispatch, useSelector } from '../../redux/store';
import { Cover } from '../components/Defaults/Cover';
// import Iconify from '../../components/iconify';
import GoogleMaps from '../../assets/GoogleMaps';

// ----------------------------------------------------------------------

export default function Reports() {
  const dispatch = useDispatch();
  // const theme = useTheme();
  // const navigate = useNavigate();

  useEffect(() => {
    dispatch(getMachineLatLongData());
  }, [dispatch]);

  const { machineLatLongCoordinates } = useSelector((state) => state.machine);
  // Functions to navigate to different pages
//  const DocumentName = () => {
//     navigate(PATH_DOCUMENT.documentName.list);
//   };
//   const linkFileCategory = () => {
//     navigate(PATH_DOCUMENT.fileCategory.list);
//   }; 

  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
        }}
      >
        <Cover name="Sites Map" icon="material-symbols:list-alt-outline" />
      </Card>
      <Grid container spacing={3}>
        <Grid item sm={12} xs={12}>
          <Card sx={{ height: '840px', mb: 5 }}>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Site Locations
                </ListSubheader>
              }
            />
            {/* </List> */}
            <GoogleMaps 
              machinesSites={machineLatLongCoordinates} 
              mapHeight={800}
            />
            {/* <ListItemButton onClick={} sx={{ color: 'text.disabled' }}>
                  <ListItemIcon>
                    <Iconify icon="" />
                  </ListItemIcon>
                  <ListItemText primary="" />
                </ListItemButton>

                <ListItemButton onClick={} sx={{ color: 'text.disabled' }}>
                  <ListItemIcon>
                    <Iconify icon="" />
                  </ListItemIcon>
                  <ListItemText primary="" />
                </ListItemButton> */}
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={0}>
        {/* <GoogleMaps
          latlongArr={latLongValues}
        /> */}
      </Grid>
    </Container>
  );
}
