import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// global
import { CONFIG } from '../../config-global';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';

import { getContacts, getContact } from '../../redux/slices/contact';






// ----------------------------------------------------------------------

export default function ContactViewForm() {

  const { contact } = useSelector((state) => state.contact);
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();


  const defaultValues = useMemo(
    () => ({
      customer: contact?.customer || 'N/A',
      firstName: contact?.firstName || 'N/A',
      lastName: contact?.lastName || 'N/A',
      title: contact?.title || 'N/A',
      contactTypes: contact?.contactTypes || 'N/A',
      phone: contact?.phone || 'N/A',
      email: contact?.email || 'N/A',

    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contact]
  );

  console.log(defaultValues); 




  return (
       <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              First Name
            </Typography>

            <Typography variant="body2">{defaultValues.firstName}</Typography>

          </Grid>


          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Last Name
            </Typography>

            <Typography variant="body2">{defaultValues.lastName}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Account Manager
            </Typography>

            <Typography variant="body2">{defaultValues.status}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Title
            </Typography>

            <Typography variant="body2">{defaultValues.title}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
             Phone
            </Typography>

            <Typography variant="body2">{defaultValues.phone}</Typography>
            
          </Grid>
          
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
             Email
            </Typography>

            <Typography variant="body2">{defaultValues.email}</Typography>
            
          </Grid>
          {/* <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Department
            </Typography>
            
            <Typography variant="body2">{defaultValues.department}</Typography>
            
          </Grid> */}

            </Grid>
            </Card>
  );
}
