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
import { PATH_MACHINE, PATH_DOCUMENT, PATH_DASHBOARD } from '../../routes/paths';
import { useDispatch } from '../../redux/store';
import { Cover } from '../components/Cover';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function Setting() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();


   // Functions to navigate to different pages
   const linkDocumentName = () => {  navigate(PATH_DOCUMENT.documentType.list); };
   const linkFileCategory = () => { navigate(PATH_DOCUMENT.documentCategory.list); };
   const linkRole = () => { navigate(PATH_DASHBOARD.role.list); };
   const linkSignInLogs = () => { navigate(PATH_DASHBOARD.user.signInLogList); };


  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
        }}
      >
        <Cover name="Settings" icon="material-symbols:list-alt-outline" />
      </Card>
      <Grid container spacing={3}>
        {/* Grid for displaying Settings related information */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: '22px'}}>
            <Card sx={{ height: '234px', mt: '14px' }}>
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Document Settings
                  </ListSubheader>
                }
              >
                <ListItemButton onClick={linkDocumentName} sx={{ color: 'text.disabled' }}>
                  <ListItemIcon>
                    <Iconify icon="mdi:rename" />
                  </ListItemIcon>
                  <ListItemText primary="Document Type" />
                </ListItemButton>

                <ListItemButton onClick={linkFileCategory} sx={{ color: 'text.disabled' }}>
                  <ListItemIcon>
                    <Iconify icon="ic:round-category" />
                  </ListItemIcon>
                  <ListItemText primary="Document Category" />
                </ListItemButton>
              </List>
            </Card>
            <Card sx={{ height: '234px', mt: '14px' }}>
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Security Settings
                  </ListSubheader>
                }>
                <ListItemButton onClick={linkRole} sx={{ color: 'text.disabled' }}>
                  <ListItemIcon>
                    <Iconify icon="carbon:user-role" />
                  </ListItemIcon>
                  <ListItemText primary="User Roles" />
                </ListItemButton>
                <ListItemButton onClick={linkSignInLogs} sx={{ color: 'text.disabled' }}>
                  <ListItemIcon>
                    <Iconify icon="mdi:clipboard-text" />
                  </ListItemIcon>
                  <ListItemText primary="User Sign In Logs" />
                </ListItemButton>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
