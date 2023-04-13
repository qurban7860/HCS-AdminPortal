import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Switch, Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { getMachineStatus, updateMachinestatus } from '../../../redux/slices/products/statuses';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

// Iconify

import { fDate } from '../../../utils/formatTime';
import StatusEditForm from './StatusEditForm';

import Iconify from '../../../components/iconify/Iconify';
import FormProvider, {
    RHFSelect,
    RHFAutocomplete,
    RHFTextField,
    RHFSwitch,
  } from '../../../components/hook-form';



// ----------------------------------------------------------------------


StatusViewForm.propTypes = {
  currentMachinestatus: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function StatusViewForm({ currentMachinestatus = null }) {


  const [editFlag, setEditFlag] = useState(false);

  const toggleEdit = () => {
    navigate(PATH_MACHINE.machineStatus.statusedit(id));
  }

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { machinestatus } = useSelector((state) => state.machinestatus);

  const { id } = useParams();

  const dispatch = useDispatch()
  

  const defaultValues = useMemo(
    () => (
      {
        name:machinestatus?.name || 'N/A',
        description:machinestatus?.description || 'N/A',
        createdAt: machinestatus?.createdAt || '',
        updatedAt: machinestatus?.updatedAt || '',
        displayOrderNo: machinestatus?.displayOrderNo || '',
        isActive: machinestatus?.isActive || true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentMachinestatus, machinestatus]
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


        <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Description
          </Typography>

          <Typography variant="body2">{defaultValues.description ? defaultValues.description : 'N/A'}</Typography>

        </Grid>
        <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Display Order No
          </Typography>

          <Typography variant="body2">{defaultValues.displayOrderNo ? defaultValues.displayOrderNo : 'N/A'}</Typography>

        </Grid>
        <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Active
          </Typography>
          <Typography variant="body2">{defaultValues.isActive  ? 'No' : 'Yes' }</Typography>

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
