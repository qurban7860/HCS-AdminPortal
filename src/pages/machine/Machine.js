import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useLayoutEffect } from 'react';
// @mui
import { useNavigate,useParams, Link } from 'react-router-dom';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Card } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import InventoryIcon from '@mui/icons-material/Inventory';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import FlareIcon from '@mui/icons-material/Flare';
import ClassIcon from '@mui/icons-material/Class';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
// import { Box, Card, Grid, Stack, Typography, Container,Checkbox, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// _mock_
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
  _appManagers,
} from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import {
  AppNewInvoice,
  AppTopRelated,
  AppAreaInstalled,
  AppCurrentDownload,
} from '../../sections/@dashboard/general/app';
// assets
import { SeoIllustration } from '../../assets/illustrations';

import { useDispatch } from '../../redux/store';


import MachineWidget from './util/MachineWidget';
import Iconify from '../../components/iconify';

import MachineDashboardNavbar from './util/MachineDashboardNavbar';

import { PATH_MACHINE } from '../../routes/paths';


// ----------------------------------------------------------------------

export default function MachineDashboardPage() {

  const dispatch = useDispatch();

  const MACHINES = [
    { group: 'FRAMA', classify: ['FRAMA 3200', 'FRAMA 3600', 'FRAMA 4200', 'FRAMA 5200', 'FRAMA 5600', 'FRAMA 6800', 'FRAMA 7600', 'FRAMA 7800', 'FRAMA 8800', 'FRAMA Custom Female interlock'] },
    { group: 'Decoiler', classify: ['0.5T Decoiler', '1.0T Decoiler', '1.5T Decoiler', '3.0T Decoiler', '5.0T Decoiler', '6.0T Decoiler'] },
    { group: 'Rivet Cutter', classify: ['Rivet Former', 'Rivet Cutter Red', 'Rivet Cutter Green', 'Rivet Cutter Blue'] },
  ];

  const theme = useTheme();
  const navigate = useNavigate();

  const { themeStretch } = useSettingsContext();

  useLayoutEffect(() => {
    // dispatch(getSites());
  }, [dispatch]);

  const linkCategory = () => 
    {
      navigate(PATH_MACHINE.categories.categories);
    };

    const linkModel = () => 
    {
      navigate(PATH_MACHINE.machineModel.model);
    };

    const linkStatus = () => 
    {
      navigate(PATH_MACHINE.machineStatus.status);
    };

    const linkSupplier = () => 
    {
      navigate(PATH_MACHINE.supplier.supplier);
    };

    const linkTechParam = () => 
    {
      navigate(PATH_MACHINE.categories.categories);
    };

    const linktpCategory = () => 
    {
      navigate(PATH_MACHINE.techParam.techParam);
    };

    const linkTool = () => 
    {
      navigate(PATH_MACHINE.tool.tool);
    };


  return (
    <>
      <Helmet>
        <title> General: App | Machine ERP</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <MachineDashboardNavbar/>

          <Grid item xs={12} md={6} lg={4}>
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
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
          <Card>
          <List
          sx={{fontSize: '0.7em'}}
              // sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              // subheader={
              //   <ListSubheader component="div" id="nested-list-subheader">
              //     Machine Modules
              //   </ListSubheader>
              // }
            >
                <ListItemButton onClick={linkCategory}
                sx={{color: 'text.disabled'}}>
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Category" />
                </ListItemButton>



                <ListItemButton sx={{color: 'text.disabled'}}
                onClick={linkModel}>
                  <ListItemIcon>
                    <ModelTrainingIcon />
                  </ListItemIcon>
                  <ListItemText primary="Model" />
                </ListItemButton>

                <ListItemButton onClick={linkStatus}
                sx={{color: 'text.disabled'}}>
                  <ListItemIcon>
                    <Diversity1Icon />
                  </ListItemIcon>
                  <ListItemText primary="Status" />
                </ListItemButton>

                <ListItemButton onClick={linkSupplier}
                sx={{color: 'text.disabled'}}>
                  <ListItemIcon>
                  <InventoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Supplier" />
                </ListItemButton>

                <ListItemButton onClick={linkTechParam}
                sx={{color: 'text.disabled'}}>
                  <ListItemIcon>
                    <FlareIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tech Param" />
                </ListItemButton>

                <ListItemButton onClick={linktpCategory}
                sx={{color: 'text.disabled'}}>
                  <ListItemIcon>
                    <ClassIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tech Param Category" />
                </ListItemButton>

                <ListItemButton onClick={linkTool}
                sx={{color: 'text.disabled'}}>
                  <ListItemIcon>
                    <BuildCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tool" />
                </ListItemButton>
      
          </List>
          </Card>
          
          
            {/* <AppAreaInstalled
              title="Sites"
              subheader="(+43%) than last year"
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                series: [
                  {
                    year: '2019',
                    data: [
                      { name: 'Asia', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
                      { name: 'America', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
                    ],
                  },
                  {
                    year: '2020',
                    data: [
                      { name: 'Asia', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                      { name: 'America', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                    ],
                  },
                ],
              }}
            /> */}
          </Grid>

          
        </Grid>
      </Container>
    </>
  );
}
