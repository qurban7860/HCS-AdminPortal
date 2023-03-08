import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { getMachinemodel, updateMachinemodel } from '../../../redux/slices/model';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

// Iconify

import { fDate } from '../../../utils/formatTime';
import ModelEditForm from './ModelEditForm';

import Iconify from '../../../components/iconify/Iconify';
import FormProvider, {
    RHFSelect,
    RHFAutocomplete,
    RHFTextField,
    RHFSwitch,
  } from '../../../components/hook-form';



// ----------------------------------------------------------------------


ModelViewForm.propTypes = {
  currentMachinemodel: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ModelViewForm({ currentMachinemodel = null }) {


  const [editFlag, setEditFlag] = useState(false);

  const toggleEdit = () => {
    dispatch(updateMachinemodel(true));
    navigate(PATH_MACHINE.machineModel.modeledit(id));
  }

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { machinemodel } = useSelector((state) => state.machinemodel);

  const { id } = useParams();

  const dispatch = useDispatch()
  

  const defaultValues = useMemo(
    () => (
      {
        name:machinemodel?.name || 'N/A',
        description:machinemodel?.description || 'N/A',
        createdAt: machinemodel?.createdAt || '',
        updatedAt: machinemodel?.updatedAt || '',
        displayOrderNo: machinemodel?.displayOrderNo || '',
        category: machinemodel?.category || '',
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentMachinemodel, machinemodel]
    );


  return (
    <Card sx={{ px: 5 }}>
      <Stack alignItems="flex-end" sx={{ mt: 2, mb: -4 }}>
        <Button
          onClick={() => { 
              toggleEdit(); 
          }}
          variant="outlined"
          startIcon={<Iconify icon="eva:edit-fill" />}
        >
          Edit
        </Button>

      </Stack>
      <Grid container>

        <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Name
          </Typography>

          <Typography variant="body2">{defaultValues.name ? defaultValues.name : 'N/A'}</Typography>

        </Grid>


        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Description
          </Typography>

          <Typography variant="body2">{defaultValues.description ? defaultValues.description : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Category Name
            </Typography>

            <Typography variant="body2">{defaultValues.category.name}</Typography>
            
          </Grid>
        

        <Grid container spacing={0} sx={{ mb: 5}}>
            <Grid item xs={12} sm={6} >
              <Typography paragraph variant="body2" sx={{ color: 'text.disabled' }}>
                Created by: Naveed, {fDate(defaultValues.createdAt)}, 192.168.10.101
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} >
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Updated by: Naveed, {fDate(defaultValues.updatedAt)}, 192.168.10.101
            </Typography>
            </Grid>
        </Grid>

      </Grid>
    </Card>
  );
}
