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

import { getAssets, getAsset } from '../../redux/slices/asset';






// ----------------------------------------------------------------------

export default function AssetViewForm() {

  const { asset } = useSelector((state) => state.asset);
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();


  const defaultValues = useMemo(
    () => ({
      id: asset?._id || '',
      name: asset?.name || '',
      status: asset?.status || '',
      tag: asset?.assetTag || '',
      model: asset?.assetModel || '',
      serial: asset?.serial || '',
      location: asset?.location || '',
      department: asset?.department?.name || '',
      image: null,
      imagePath: asset?.image || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [asset]
  );

  // console.log(defaultValues); 




  return (
       <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Serial
            </Typography>

            <Typography variant="body2">{defaultValues.serial}</Typography>

          </Grid>


          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Model
            </Typography>

            <Typography variant="body2">{defaultValues.model}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Status
            </Typography>

            <Typography variant="body2">{defaultValues.status}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Asset Tag
            </Typography>

            <Typography variant="body2">{defaultValues.tag}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Location
            </Typography>

            <Typography variant="body2">{defaultValues.location}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Department
            </Typography>
            
            <Typography variant="body2">{defaultValues.department}</Typography>
            
          </Grid>

            </Grid>
            </Card>
  );
}
