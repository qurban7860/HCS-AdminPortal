import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
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




// ----------------------------------------------------------------------

const COUNTRIES = [
  { id: '1', value: 'New Zealand' },
  { id: '2', value: 'Canada' },
  { id: '3', value: 'USA' },
  { id: '4', value: 'Portugal' },
];

const STATUS_OPTION = [
  { id: '1', value: 'Order Received' },
  { id: '2', value: 'In Progress' },
  { id: '3', value: 'Ready For Transport' },
  { id: '4', value: 'In Freight' },
  { id: '5', value: 'Deployed' },
  { id: '6', value: 'Archived' },
];
const CATEGORY_OPTION = [
  { group: 'FRAMA', classify: ['FRAMA 3200', 'FRAMA 3600', 'FRAMA 4200', 'FRAMA 5200', 'FRAMA 5600', 'FRAMA 6800', 'FRAMA 7600', 'FRAMA 7800', 'FRAMA 8800', 'FRAMA Custom Female interlock'] },
  { group: 'Decoiler', classify: ['0.5T Decoiler', '1.0T Decoiler', '1.5T Decoiler', '3.0T Decoiler', '5.0T Decoiler', '6.0T Decoiler'] },
  { group: 'Rivet Cutter', classify: ['Rivet Former', 'Rivet Cutter Red', 'Rivet Cutter Green', 'Rivet Cutter Blue'] },
];

// ----------------------------------------------------------------------

AssetViewForm.propTypes = {
  currentAsset: PropTypes.object,
};

export default function AssetViewForm({ currentAsset }) {

  const { isLoading, error } = useSelector((state) => state.asset);

  const { departments } = useSelector((state) => state.department);
  
  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  if (departments !== undefined){
    const currentDept = departments.find(o => o._id === currentAsset.department);
  }

  const defaultValues = useMemo(
    () => ({
      id: currentAsset?._id || '',
      name: currentAsset.name === "" ? 'N/A' : currentAsset.name,
      status: currentAsset.status === "" ? 'N/A' : currentAsset.status,
      tag: currentAsset.assetTag === "" ? 'N/A' : currentAsset.assetTag,
      model: currentAsset.assetModel === "" ? 'N/A' : currentAsset.assetModel,
      serial: currentAsset.serial === "" ? 'N/A' : currentAsset.serial,
      location: currentAsset.location === "" ? 'N/A' : currentAsset.location,
      department: currentAsset.department === "" ? 'N/A' : currentAsset.department ,

      image: null,
      imagePath: currentAsset?.image || null,
      replaceImage: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentAsset]
  );


  // const {
  //   reset,
  //   watch,
  //   setValue,
  // } = methods;



  return (
       <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
      {/* <Grid container spacing={0}>
        <Grid item xs={7} md={7}>
          <Card sx={{ p: 3 }}> */}

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

          {/* <LoadingButton variant="contained" size="large" loading={isSubmitting}>
              Edit Asset
          </LoadingButton> */}
            {/* <Stack spacing={3}>
              <RHFTextField style={{color: "red"}} disabled color="primary" name="name" label="Asset Name" />

              <RHFTextField name="serial" label="Serial" />

              <RHFSelect native name="model" label="Model">
                  <option value="" />
                  {CATEGORY_OPTION.map((model) => (
                    <optgroup key={model.group} label={model.group}>
                      {model.classify.map((classify) => (
                        <option key={classify} value={classify}>
                          {classify}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </RHFSelect>

                <RHFSelect xs={3} md={4} native name="status" label="Status">
                <option value="" disabled/>
                  {STATUS_OPTION.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.value}
                    </option>
                  ))}
                </RHFSelect>

                <RHFTextField name="tag" label="Asset Tag" />

                <RHFSelect native name="location" label="Location">
                <option value="" disabled/>
                {COUNTRIES.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </RHFSelect>

                    <RHFSelect native name="department" label="Department">
                    <option value="" disabled/>
                    {departments.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                    </RHFSelect>



              {/* <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Notes
                </Typography>

                <RHFEditor simple name="notes" />
              </Stack>  */}


              {/* </Grid> */}



              
            {/* </Stack>  */}

            </Grid>
            </Card>
  );
}
