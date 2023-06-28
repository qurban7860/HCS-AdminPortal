import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate,useParams, Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Card } from '@mui/material';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CategoryIcon from '@mui/icons-material/Category';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import InventoryIcon from '@mui/icons-material/Inventory';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import FlareIcon from '@mui/icons-material/Flare';
import ClassIcon from '@mui/icons-material/Class';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { PATH_MACHINE } from '../../routes/paths';
import { useDispatch } from '../../redux/store';
import { Cover } from '../components/Cover';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function Machine() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();



  const MACHINES = [
    { group: 'FRAMA', classify: ['FRAMA 3200', 'FRAMA 3600', 'FRAMA 4200', 'FRAMA 5200', 'FRAMA 5600', 'FRAMA 6800', 'FRAMA 7600', 'FRAMA 7800', 'FRAMA 8800', 'FRAMA Custom Female interlock'] },
    { group: 'Decoiler', classify: ['0.5T Decoiler', '1.0T Decoiler', '1.5T Decoiler', '3.0T Decoiler', '5.0T Decoiler', '6.0T Decoiler'] },
    { group: 'Rivet Cutter', classify: ['Rivet Former', 'Rivet Cutter Red', 'Rivet Cutter Green', 'Rivet Cutter Blue'] },
  ];

   // Functions to navigate to different pages
   const linkCategory = () => { navigate(PATH_MACHINE.machines.settings.categories.list); };
   const linkModel = () => { navigate(PATH_MACHINE.machines.settings.machineModel.list); };
   const linkStatus = () => { navigate(PATH_MACHINE.machines.settings.machineStatus.list); };
   const linkSupplier = () => { navigate(PATH_MACHINE.machines.settings.supplier.list); };
   const linkTechParam = () => { navigate(PATH_MACHINE.machines.settings.machineParameters.list); };
   const linktpCategory = () => { navigate(PATH_MACHINE.machines.settings.machineTechnicalParameterCategories.list); };
   const linkTool = () => { navigate(PATH_MACHINE.machines.settings.tool.list); };




  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
          // mt: '24px',
        }}
      >
        <Cover name="Settings" icon="material-symbols:list-alt-outline" />
      </Card>
      <Grid container spacing={3}>
        {/* Navigation Bar */}
        {/* <MachineDashboardNavbar/> */}

        {/* Grid for displaying machine related information */}
        <Grid container spacing={2}>
          {/* <Grid item xs={12} md={6} lg={4} sx={{mt: 3}}>
            <AppCurrentDownload
              title="Current Machines"
              chart={{
                colors: [
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  // theme.palette.error.main,
                  theme.palette.warning.main,
                ],
                series: [
                  { label: 'FRAMA', value: 10 },
                  { label: 'Decoiler', value: 6 },
                  { label: 'Rivet Cutter', value: 4 },
                ],
              }}
            />
          </Grid> */}

          <Grid item xs={12} md={6} lg={4} sx={{ ml: '22px' }}>
            <Card sx={{ height: '234px', mt: '14px' }}>
              <List
                // sx={{fontSize: '0.7em'}}
                // sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Common Settings
                  </ListSubheader>
                }
              >
                <ListItemButton onClick={linkCategory} sx={{ color: 'text.disabled' }}>
                  <ListItemIcon>
                    <Iconify icon="mdi:shape-plus" />
                  </ListItemIcon>
                  <ListItemText primary="Machine Categories" />
                </ListItemButton>

                <ListItemButton onClick={linkModel} sx={{ color: 'text.disabled' }}>
                  <ListItemIcon>
                    <Iconify icon="mdi:cube-outline" />
                  </ListItemIcon>
                  <ListItemText primary="Machines Models" />
                </ListItemButton>

                <ListItemButton onClick={linkSupplier} sx={{ color: 'text.disabled' }}>
                  <ListItemIcon>
                    <Iconify icon="mdi:circle-opacity" />
                  </ListItemIcon>
                  <ListItemText primary="Machine Suppliers" />
                </ListItemButton>

                <ListItemButton onClick={linkStatus} sx={{ color: 'text.disabled' }}>
                  <ListItemIcon>
                    <Iconify icon="mdi:list-status" />
                  </ListItemIcon>
                  <ListItemText primary="Machine Status" />
                </ListItemButton>
              </List>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: '22px' }}>
            <Card sx={{ height: '234px', mt: '14px' }}>
              <List
                sx={{ fontSize: '0.7em' }}
                // sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Technical Settings
                  </ListSubheader>
                }
              >
                <ListItemButton onClick={linktpCategory} sx={{ color: 'text.disabled' }}>
                  <ListItemIcon>
                    <Iconify icon="mdi:table-cog" />
                  </ListItemIcon>
                  <ListItemText primary="Setting Categories" />
                </ListItemButton>

                <ListItemButton onClick={linkTechParam} sx={{ color: 'text.disabled' }}>
                  <ListItemIcon>
                    <Iconify icon="mdi:abacus" />
                  </ListItemIcon>
                  <ListItemText primary="Parameters" />
                </ListItemButton>
              </List>
              <List
                sx={{ fontSize: '0.7em' }}
                // sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Tools Information
                  </ListSubheader>
                }
              >
                <ListItemButton onClick={linkTool} sx={{ color: 'text.disabled' }}>
                  <ListItemIcon>
                    <Iconify icon="mdi:tools" />
                  </ListItemIcon>
                  <ListItemText primary="Tools" />
                </ListItemButton>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
